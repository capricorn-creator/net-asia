const TYPE_NUM: Record<string, number> = { A: 1, NS: 2, CNAME: 5, MX: 15, TXT: 16, AAAA: 28 };
const TYPE_NAME: Record<number, string> = { 1: 'A', 2: 'NS', 5: 'CNAME', 15: 'MX', 16: 'TXT', 28: 'AAAA' };

export interface WireAnswer {
  type: string;
  data: string;
}

export interface WireResult {
  rcode: number;
  answers: WireAnswer[];
}

export function buildQuery(name: string, type: string): Uint8Array {
  const enc = new TextEncoder();
  // id=0, flags=RD, 1 question, 0 answer/authority/additional
  const bytes: number[] = [0, 0, 0x01, 0x00, 0, 1, 0, 0, 0, 0, 0, 0];
  for (const label of name.replace(/\.$/, '').split('.')) {
    const b = enc.encode(label);
    bytes.push(b.length, ...b);
  }
  bytes.push(0, 0, TYPE_NUM[type], 0, 1); // end of name, QTYPE, QCLASS=IN
  return new Uint8Array(bytes);
}

export function toBase64Url(bytes: Uint8Array): string {
  let s = '';
  bytes.forEach(b => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function readName(buf: Uint8Array, offset: number): [string, number] {
  const dec = new TextDecoder();
  const labels: string[] = [];
  let pos = offset;
  let end = -1;
  let jumps = 0;
  for (;;) {
    const len = buf[pos];
    if (len === undefined) throw new Error('truncated DNS message');
    if (len === 0) {
      pos++;
      break;
    }
    if ((len & 0xc0) === 0xc0) {
      if (end < 0) end = pos + 2;
      pos = ((len & 0x3f) << 8) | buf[pos + 1];
      if (++jumps > 20) throw new Error('DNS compression loop');
      continue;
    }
    labels.push(dec.decode(buf.subarray(pos + 1, pos + 1 + len)));
    pos += 1 + len;
  }
  return [labels.join('.'), end < 0 ? pos : end];
}

function ipv6(buf: Uint8Array, off: number): string {
  const g = Array.from({ length: 8 }, (_, i) => ((buf[off + 2 * i] << 8) | buf[off + 2 * i + 1]).toString(16));
  let bestStart = -1;
  let bestLen = 0;
  for (let i = 0; i < 8; ) {
    if (g[i] !== '0') {
      i++;
      continue;
    }
    let j = i;
    while (j < 8 && g[j] === '0') j++;
    if (j - i > bestLen) {
      bestStart = i;
      bestLen = j - i;
    }
    i = j;
  }
  if (bestLen < 2) return g.join(':');
  return `${g.slice(0, bestStart).join(':')}::${g.slice(bestStart + bestLen).join(':')}`;
}

export function parseResponse(buf: Uint8Array): WireResult {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const dec = new TextDecoder();
  const rcode = dv.getUint8(3) & 0x0f;
  const questions = dv.getUint16(4);
  const answerCount = dv.getUint16(6);
  let pos = 12;
  for (let i = 0; i < questions; i++) pos = readName(buf, pos)[1] + 4;

  const answers: WireAnswer[] = [];
  for (let i = 0; i < answerCount; i++) {
    pos = readName(buf, pos)[1];
    const type = dv.getUint16(pos);
    const rdLength = dv.getUint16(pos + 8);
    pos += 10;
    const rd = pos;
    pos += rdLength;

    const name = TYPE_NAME[type];
    if (!name) continue;
    let data: string;
    if (type === 1) data = `${buf[rd]}.${buf[rd + 1]}.${buf[rd + 2]}.${buf[rd + 3]}`;
    else if (type === 28) data = ipv6(buf, rd);
    else if (type === 2 || type === 5) data = readName(buf, rd)[0];
    else if (type === 15) data = `${dv.getUint16(rd)} ${readName(buf, rd + 2)[0]}`;
    else {
      // TXT: one or more length-prefixed strings, concatenated
      let t = '';
      let p = rd;
      while (p < rd + rdLength) {
        const len = buf[p];
        t += dec.decode(buf.subarray(p + 1, p + 1 + len));
        p += 1 + len;
      }
      data = t;
    }
    answers.push({ type: name, data });
  }
  return { rcode, answers };
}