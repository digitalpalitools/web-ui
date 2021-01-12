import * as wasm from './pali_core_bg.wasm';

let WASM_VECTOR_LEN = 0;

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
* @param {string} str1
* @param {string} str2
* @returns {number}
*/
export function string_compare(str1, str2) {
    var ptr0 = passStringToWasm0(str1, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(str2, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.string_compare(ptr0, len0, ptr1, len1);
    return ret;
}

/**
* @param {string} str1
* @returns {number}
*/
export function string_length(str1) {
    var ptr0 = passStringToWasm0(str1, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.string_length(ptr0, len0);
    return ret >>> 0;
}

/**
*/
export const PaliAlphabet = Object.freeze({ A:0,"0":"A",AA:1,"1":"AA",I:2,"2":"I",II:3,"3":"II",U:4,"4":"U",UU:5,"5":"UU",E:6,"6":"E",O:7,"7":"O",K:8,"8":"K",KH:9,"9":"KH",G:10,"10":"G",GH:11,"11":"GH",QuoteN:12,"12":"QuoteN",C:13,"13":"C",CH:14,"14":"CH",J:15,"15":"J",JH:16,"16":"JH",TildeN:17,"17":"TildeN",DotT:18,"18":"DotT",DotTH:19,"19":"DotTH",DotD:20,"20":"DotD",DotDH:21,"21":"DotDH",DotN:22,"22":"DotN",T:23,"23":"T",TH:24,"24":"TH",D:25,"25":"D",DH:26,"26":"DH",N:27,"27":"N",P:28,"28":"P",PH:29,"29":"PH",B:30,"30":"B",BH:31,"31":"BH",M:32,"32":"M",Y:33,"33":"Y",R:34,"34":"R",L:35,"35":"L",V:36,"36":"V",S:37,"37":"S",H:38,"38":"H",DotL:39,"39":"DotL",DotM:40,"40":"DotM", });

