(function () {
  'use strict';

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */


  function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  function _loadWasmModule (sync, filepath, src, imports) {
    function _instantiateOrCompile(source, imports, stream) {
      var instantiateFunc = stream ? WebAssembly.instantiateStreaming : WebAssembly.instantiate;
      var compileFunc = stream ? WebAssembly.compileStreaming : WebAssembly.compile;

      if (imports) {
        return instantiateFunc(source, imports)
      } else {
        return compileFunc(source)
      }
    }

    
  var buf = null;
  if (filepath) {
    
  return _instantiateOrCompile(fetch(filepath), imports, true);

  }


  var raw = globalThis.atob(src);
  var rawLength = raw.length;
  buf = new Uint8Array(new ArrayBuffer(rawLength));
  for(var i = 0; i < rawLength; i++) {
     buf[i] = raw.charCodeAt(i);
  }



    if(sync) {
      var mod = new WebAssembly.Module(buf);
      return imports ? new WebAssembly.Instance(mod, imports) : mod
    } else {
      return _instantiateOrCompile(buf, imports, false)
    }
  }

  function getMixFetchWasmBytes(imports){return _loadWasmModule(0, new URL('mix_fetch_wasm_bg.wasm', import.meta.url), null, imports)}

  function getGoConnectionWasmBytes(imports){return _loadWasmModule(0, new URL('go_conn.wasm', import.meta.url), null, imports)}

  let wasm;

  const heap = new Array(128).fill(undefined);

  heap.push(undefined, null, true, false);

  function getObject(idx) { return heap[idx]; }

  let WASM_VECTOR_LEN = 0;

  let cachedUint8Memory0 = null;

  function getUint8Memory0() {
      if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
          cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
      }
      return cachedUint8Memory0;
  }

  const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

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
          const ptr = malloc(buf.length, 1) >>> 0;
          getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
          WASM_VECTOR_LEN = buf.length;
          return ptr;
      }

      let len = arg.length;
      let ptr = malloc(len, 1) >>> 0;

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
          ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
          const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
          const ret = encodeString(arg, view);

          offset += ret.written;
      }

      WASM_VECTOR_LEN = offset;
      return ptr;
  }

  function isLikeNone(x) {
      return x === undefined || x === null;
  }

  let cachedInt32Memory0 = null;

  function getInt32Memory0() {
      if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
          cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
      }
      return cachedInt32Memory0;
  }

  let heap_next = heap.length;

  function dropObject(idx) {
      if (idx < 132) return;
      heap[idx] = heap_next;
      heap_next = idx;
  }

  function takeObject(idx) {
      const ret = getObject(idx);
      dropObject(idx);
      return ret;
  }

  let cachedFloat64Memory0 = null;

  function getFloat64Memory0() {
      if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
          cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
      }
      return cachedFloat64Memory0;
  }

  function addHeapObject(obj) {
      if (heap_next === heap.length) heap.push(heap.length + 1);
      const idx = heap_next;
      heap_next = heap[idx];

      heap[idx] = obj;
      return idx;
  }

  const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

  if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); }
  function getStringFromWasm0(ptr, len) {
      ptr = ptr >>> 0;
      return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
  }

  let cachedBigInt64Memory0 = null;

  function getBigInt64Memory0() {
      if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
          cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
      }
      return cachedBigInt64Memory0;
  }

  function debugString(val) {
      // primitive types
      const type = typeof val;
      if (type == 'number' || type == 'boolean' || val == null) {
          return  `${val}`;
      }
      if (type == 'string') {
          return `"${val}"`;
      }
      if (type == 'symbol') {
          const description = val.description;
          if (description == null) {
              return 'Symbol';
          } else {
              return `Symbol(${description})`;
          }
      }
      if (type == 'function') {
          const name = val.name;
          if (typeof name == 'string' && name.length > 0) {
              return `Function(${name})`;
          } else {
              return 'Function';
          }
      }
      // objects
      if (Array.isArray(val)) {
          const length = val.length;
          let debug = '[';
          if (length > 0) {
              debug += debugString(val[0]);
          }
          for(let i = 1; i < length; i++) {
              debug += ', ' + debugString(val[i]);
          }
          debug += ']';
          return debug;
      }
      // Test for built-in
      const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
      let className;
      if (builtInMatches.length > 1) {
          className = builtInMatches[1];
      } else {
          // Failed to match the standard '[object ClassName]'
          return toString.call(val);
      }
      if (className == 'Object') {
          // we're a user defined class or Object
          // JSON.stringify avoids problems with cycles, and is generally much
          // easier than looping through ownProperties of `val`.
          try {
              return 'Object(' + JSON.stringify(val) + ')';
          } catch (_) {
              return 'Object';
          }
      }
      // errors
      if (val instanceof Error) {
          return `${val.name}: ${val.message}\n${val.stack}`;
      }
      // TODO we could test for more things here, like `Set`s and `Map`s.
      return className;
  }

  function makeMutClosure(arg0, arg1, dtor, f) {
      const state = { a: arg0, b: arg1, cnt: 1, dtor };
      const real = (...args) => {
          // First up with a closure we increment the internal reference
          // count. This ensures that the Rust closure environment won't
          // be deallocated while we're invoking it.
          state.cnt++;
          const a = state.a;
          state.a = 0;
          try {
              return f(a, state.b, ...args);
          } finally {
              if (--state.cnt === 0) {
                  wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

              } else {
                  state.a = a;
              }
          }
      };
      real.original = state;

      return real;
  }
  function __wbg_adapter_48(arg0, arg1, arg2) {
      try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h82ba29bd2a7c774c(retptr, arg0, arg1, addHeapObject(arg2));
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          if (r1) {
              throw takeObject(r0);
          }
      } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
      }
  }

  function makeClosure(arg0, arg1, dtor, f) {
      const state = { a: arg0, b: arg1, cnt: 1, dtor };
      const real = (...args) => {
          // First up with a closure we increment the internal reference
          // count. This ensures that the Rust closure environment won't
          // be deallocated while we're invoking it.
          state.cnt++;
          try {
              return f(state.a, state.b, ...args);
          } finally {
              if (--state.cnt === 0) {
                  wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
                  state.a = 0;

              }
          }
      };
      real.original = state;

      return real;
  }
  function __wbg_adapter_51(arg0, arg1, arg2) {
      wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h085f339610edd828(arg0, arg1, addHeapObject(arg2));
  }

  function __wbg_adapter_54(arg0, arg1) {
      wasm._dyn_core__ops__function__Fn_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__he100da6fe16ad17f(arg0, arg1);
  }

  function __wbg_adapter_57(arg0, arg1) {
      wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h572738991d118b0b(arg0, arg1);
  }

  function __wbg_adapter_60(arg0, arg1) {
      wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h409e85469a68ad52(arg0, arg1);
  }

  function __wbg_adapter_63(arg0, arg1, arg2) {
      wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h340d96036bea55d0(arg0, arg1, addHeapObject(arg2));
  }

  function __wbg_adapter_70(arg0, arg1) {
      wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h4a48f3ce5e2a3920(arg0, arg1);
  }

  function __wbg_adapter_73(arg0, arg1, arg2) {
      wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__ha17e88e118a96800(arg0, arg1, addHeapObject(arg2));
  }

  function _assertClass(instance, klass) {
      if (!(instance instanceof klass)) {
          throw new Error(`expected instance of ${klass.name}`);
      }
      return instance.ptr;
  }
  /**
  * @param {MixFetchOpts} opts
  * @returns {Promise<any>}
  */
  function setupMixFetch(opts) {
      const ret = wasm.setupMixFetch(addHeapObject(opts));
      return takeObject(ret);
  }

  /**
  * @returns {Promise<Promise<any>>}
  */
  function disconnectMixFetch() {
      const ret = wasm.disconnectMixFetch();
      return takeObject(ret);
  }

  function passArray8ToWasm0(arg, malloc) {
      const ptr = malloc(arg.length * 1, 1) >>> 0;
      getUint8Memory0().set(arg, ptr / 1);
      WASM_VECTOR_LEN = arg.length;
      return ptr;
  }
  /**
  * Called by go runtime whenever local connection produces any data that has to be sent to the remote.
  * @param {string} stringified_request_id
  * @param {Uint8Array} data
  * @returns {Promise<any>}
  */
  function send_client_data(stringified_request_id, data) {
      const ptr0 = passStringToWasm0(stringified_request_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      const ret = wasm.send_client_data(ptr0, len0, ptr1, len1);
      return takeObject(ret);
  }

  /**
  * Called by go runtime whenever it establishes new connection
  * (whether the initial one or on any redirection attempt).
  * @param {string} target
  * @returns {Promise<any>}
  */
  function start_new_mixnet_connection(target) {
      const ptr0 = passStringToWasm0(target, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.start_new_mixnet_connection(ptr0, len0);
      return takeObject(ret);
  }

  /**
  * @returns {boolean}
  */
  function mix_fetch_initialised() {
      try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm.mix_fetch_initialised(retptr);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var r2 = getInt32Memory0()[retptr / 4 + 2];
          if (r2) {
              throw takeObject(r1);
          }
          return r0 !== 0;
      } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
      }
  }

  /**
  * Called by go runtime whenever it's done with a connection
  * @param {string} stringified_request_id
  * @returns {Promise<any>}
  */
  function finish_mixnet_connection(stringified_request_id) {
      const ptr0 = passStringToWasm0(stringified_request_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.finish_mixnet_connection(ptr0, len0);
      return takeObject(ret);
  }

  function getArrayU8FromWasm0(ptr, len) {
      ptr = ptr >>> 0;
      return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
  }

  /**
  */
  function set_panic_hook() {
      wasm.set_panic_hook();
  }

  function handleError(f, args) {
      try {
          return f.apply(this, args);
      } catch (e) {
          wasm.__wbindgen_exn_store(addHeapObject(e));
      }
  }
  function __wbg_adapter_407(arg0, arg1, arg2, arg3) {
      wasm.wasm_bindgen__convert__closures__invoke2_mut__hb40b977de175d84c(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
  }
  /**
  */
  class ClientStorage {

      static __wrap(ptr) {
          ptr = ptr >>> 0;
          const obj = Object.create(ClientStorage.prototype);
          obj.__wbg_ptr = ptr;

          return obj;
      }

      __destroy_into_raw() {
          const ptr = this.__wbg_ptr;
          this.__wbg_ptr = 0;

          return ptr;
      }

      free() {
          const ptr = this.__destroy_into_raw();
          wasm.__wbg_clientstorage_free(ptr);
      }
      /**
      * @param {string} client_id
      * @param {string | undefined} passphrase
      * @returns {Promise<ClientStorage>}
      */
      static new_async(client_id, passphrase) {
          const ptr0 = passStringToWasm0(client_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          var ptr1 = isLikeNone(passphrase) ? 0 : passStringToWasm0(passphrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          var len1 = WASM_VECTOR_LEN;
          const ret = wasm.clientstorage_new_async(ptr0, len0, ptr1, len1);
          return takeObject(ret);
      }
      /**
      * @param {string} client_id
      * @param {string} passphrase
      */
      constructor(client_id, passphrase) {
          const ptr0 = passStringToWasm0(client_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          const ptr1 = passStringToWasm0(passphrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len1 = WASM_VECTOR_LEN;
          const ret = wasm.clientstorage_new(ptr0, len0, ptr1, len1);
          return takeObject(ret);
      }
      /**
      * @param {string} client_id
      * @returns {Promise<any>}
      */
      static new_unencrypted(client_id) {
          const ptr0 = passStringToWasm0(client_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          const ret = wasm.clientstorage_new_unencrypted(ptr0, len0);
          return takeObject(ret);
      }
  }
  /**
  */
  class MixFetchClient {

      static __wrap(ptr) {
          ptr = ptr >>> 0;
          const obj = Object.create(MixFetchClient.prototype);
          obj.__wbg_ptr = ptr;

          return obj;
      }

      __destroy_into_raw() {
          const ptr = this.__wbg_ptr;
          this.__wbg_ptr = 0;

          return ptr;
      }

      free() {
          const ptr = this.__destroy_into_raw();
          wasm.__wbg_mixfetchclient_free(ptr);
      }
      /**
      * @param {MixFetchConfig} config
      * @param {boolean} force_tls
      * @param {string | undefined} preferred_gateway
      * @param {string | undefined} storage_passphrase
      * @param {HackOpts | undefined} hack_opts
      */
      constructor(config, force_tls, preferred_gateway, storage_passphrase, hack_opts) {
          _assertClass(config, MixFetchConfig);
          var ptr0 = config.__destroy_into_raw();
          var ptr1 = isLikeNone(preferred_gateway) ? 0 : passStringToWasm0(preferred_gateway, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          var len1 = WASM_VECTOR_LEN;
          var ptr2 = isLikeNone(storage_passphrase) ? 0 : passStringToWasm0(storage_passphrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          var len2 = WASM_VECTOR_LEN;
          const ret = wasm.mixfetchclient_new(ptr0, force_tls, ptr1, len1, ptr2, len2, isLikeNone(hack_opts) ? 0 : addHeapObject(hack_opts));
          return takeObject(ret);
      }
      /**
      * @returns {boolean}
      */
      active() {
          const ret = wasm.mixfetchclient_active(this.__wbg_ptr);
          return ret !== 0;
      }
      /**
      * @returns {Promise<void>}
      */
      disconnect() {
          const ret = wasm.mixfetchclient_disconnect(this.__wbg_ptr);
          return takeObject(ret);
      }
      /**
      * @returns {string}
      */
      self_address() {
          let deferred1_0;
          let deferred1_1;
          try {
              const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
              wasm.mixfetchclient_self_address(retptr, this.__wbg_ptr);
              var r0 = getInt32Memory0()[retptr / 4 + 0];
              var r1 = getInt32Memory0()[retptr / 4 + 1];
              deferred1_0 = r0;
              deferred1_1 = r1;
              return getStringFromWasm0(r0, r1);
          } finally {
              wasm.__wbindgen_add_to_stack_pointer(16);
              wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
          }
      }
  }
  /**
  */
  class MixFetchConfig {

      static __wrap(ptr) {
          ptr = ptr >>> 0;
          const obj = Object.create(MixFetchConfig.prototype);
          obj.__wbg_ptr = ptr;

          return obj;
      }

      __destroy_into_raw() {
          const ptr = this.__wbg_ptr;
          this.__wbg_ptr = 0;

          return ptr;
      }

      free() {
          const ptr = this.__destroy_into_raw();
          wasm.__wbg_mixfetchconfig_free(ptr);
      }
      /**
      * @param {string} network_requester_address
      * @param {MixFetchConfigOpts | undefined} opts
      */
      constructor(network_requester_address, opts) {
          try {
              const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
              const ptr0 = passStringToWasm0(network_requester_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
              const len0 = WASM_VECTOR_LEN;
              wasm.mixfetchconfig_new(retptr, ptr0, len0, isLikeNone(opts) ? 0 : addHeapObject(opts));
              var r0 = getInt32Memory0()[retptr / 4 + 0];
              var r1 = getInt32Memory0()[retptr / 4 + 1];
              var r2 = getInt32Memory0()[retptr / 4 + 2];
              if (r2) {
                  throw takeObject(r1);
              }
              return MixFetchConfig.__wrap(r0);
          } finally {
              wasm.__wbindgen_add_to_stack_pointer(16);
          }
      }
      /**
      * @param {number} timeout_ms
      * @returns {MixFetchConfig}
      */
      with_mix_fetch_timeout(timeout_ms) {
          const ptr = this.__destroy_into_raw();
          const ret = wasm.mixfetchconfig_with_mix_fetch_timeout(ptr, timeout_ms);
          return MixFetchConfig.__wrap(ret);
      }
  }

  async function __wbg_load(module, imports) {
      if (typeof Response === 'function' && module instanceof Response) {
          if (typeof WebAssembly.instantiateStreaming === 'function') {
              try {
                  return await WebAssembly.instantiateStreaming(module, imports);

              } catch (e) {
                  if (module.headers.get('Content-Type') != 'application/wasm') {
                      console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                  } else {
                      throw e;
                  }
              }
          }

          const bytes = await module.arrayBuffer();
          return await WebAssembly.instantiate(bytes, imports);

      } else {
          const instance = await WebAssembly.instantiate(module, imports);

          if (instance instanceof WebAssembly.Instance) {
              return { instance, module };

          } else {
              return instance;
          }
      }
  }

  function __wbg_get_imports() {
      const imports = {};
      imports.wbg = {};
      imports.wbg.__wbindgen_is_undefined = function(arg0) {
          const ret = getObject(arg0) === undefined;
          return ret;
      };
      imports.wbg.__wbindgen_in = function(arg0, arg1) {
          const ret = getObject(arg0) in getObject(arg1);
          return ret;
      };
      imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
          const obj = getObject(arg1);
          const ret = typeof(obj) === 'string' ? obj : undefined;
          var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          var len1 = WASM_VECTOR_LEN;
          getInt32Memory0()[arg0 / 4 + 1] = len1;
          getInt32Memory0()[arg0 / 4 + 0] = ptr1;
      };
      imports.wbg.__wbindgen_is_object = function(arg0) {
          const val = getObject(arg0);
          const ret = typeof(val) === 'object' && val !== null;
          return ret;
      };
      imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
          takeObject(arg0);
      };
      imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
          const obj = getObject(arg1);
          const ret = typeof(obj) === 'number' ? obj : undefined;
          getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
          getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
      };
      imports.wbg.__wbindgen_boolean_get = function(arg0) {
          const v = getObject(arg0);
          const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
          return ret;
      };
      imports.wbg.__wbindgen_is_string = function(arg0) {
          const ret = typeof(getObject(arg0)) === 'string';
          return ret;
      };
      imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
          const ret = getObject(arg0);
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
          const ret = new Error(getStringFromWasm0(arg0, arg1));
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
          const ret = getStringFromWasm0(arg0, arg1);
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_goWasmInjectServerData_f79a1e364676e30d = function(arg0, arg1, arg2, arg3) {
          let deferred0_0;
          let deferred0_1;
          try {
              deferred0_0 = arg0;
              deferred0_1 = arg1;
              var v1 = getArrayU8FromWasm0(arg2, arg3).slice();
              wasm.__wbindgen_free(arg2, arg3 * 1);
              __go_rs_bridge__.goWasmInjectServerData(getStringFromWasm0(arg0, arg1), v1);
          } finally {
              wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
          }
      };
      imports.wbg.__wbg_goWasmCloseRemoteSocket_f3eb6f750606826a = function(arg0, arg1) {
          let deferred0_0;
          let deferred0_1;
          try {
              deferred0_0 = arg0;
              deferred0_1 = arg1;
              __go_rs_bridge__.goWasmCloseRemoteSocket(getStringFromWasm0(arg0, arg1));
          } finally {
              wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
          }
      };
      imports.wbg.__wbg_goWasmInjectConnError_b204ba85f40cd478 = function(arg0, arg1, arg2, arg3) {
          let deferred0_0;
          let deferred0_1;
          let deferred1_0;
          let deferred1_1;
          try {
              deferred0_0 = arg0;
              deferred0_1 = arg1;
              deferred1_0 = arg2;
              deferred1_1 = arg3;
              __go_rs_bridge__.goWasmInjectConnError(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
          } finally {
              wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
              wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
          }
      };
      imports.wbg.__wbg_goWasmSetMixFetchRequestTimeout_322d5553a0013c00 = function(arg0) {
          __go_rs_bridge__.goWasmSetMixFetchRequestTimeout(arg0 >>> 0);
      };
      imports.wbg.__wbg_mixfetchclient_new = function(arg0) {
          const ret = MixFetchClient.__wrap(arg0);
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_is_bigint = function(arg0) {
          const ret = typeof(getObject(arg0)) === 'bigint';
          return ret;
      };
      imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
          const ret = arg0;
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
          const ret = getObject(arg0) === getObject(arg1);
          return ret;
      };
      imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
          const ret = BigInt.asUintN(64, arg0);
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_clientstorage_new = function(arg0) {
          const ret = ClientStorage.__wrap(arg0);
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
          const ret = new Error();
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
          const ret = getObject(arg1).stack;
          const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len1 = WASM_VECTOR_LEN;
          getInt32Memory0()[arg0 / 4 + 1] = len1;
          getInt32Memory0()[arg0 / 4 + 0] = ptr1;
      };
      imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
          let deferred0_0;
          let deferred0_1;
          try {
              deferred0_0 = arg0;
              deferred0_1 = arg1;
              console.error(getStringFromWasm0(arg0, arg1));
          } finally {
              wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
          }
      };
      imports.wbg.__wbindgen_cb_drop = function(arg0) {
          const obj = takeObject(arg0).original;
          if (obj.cnt-- == 1) {
              obj.a = 0;
              return true;
          }
          const ret = false;
          return ret;
      };
      imports.wbg.__wbg_Window_2323448e22bf340f = function(arg0) {
          const ret = getObject(arg0).Window;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_WorkerGlobalScope_4f52a4f4757baa51 = function(arg0) {
          const ret = getObject(arg0).WorkerGlobalScope;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_global_bb13ba737d1fd37d = function(arg0) {
          const ret = getObject(arg0).global;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_indexedDB_553c6eee256a5956 = function() { return handleError(function (arg0) {
          const ret = getObject(arg0).indexedDB;
          return isLikeNone(ret) ? 0 : addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_clearInterval_bd072ecb096d9775 = function(arg0) {
          const ret = clearInterval(takeObject(arg0));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_setInterval_edede8e2124cbb00 = function() { return handleError(function (arg0, arg1) {
          const ret = setInterval(getObject(arg0), arg1);
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_performance_1430613edb72ce03 = function(arg0) {
          const ret = getObject(arg0).performance;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_now_eab901b1d3b8a295 = function(arg0) {
          const ret = getObject(arg0).now();
          return ret;
      };
      imports.wbg.__wbg_setTimeout_fba1b48a90e30862 = function() { return handleError(function (arg0, arg1, arg2) {
          const ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
          return ret;
      }, arguments) };
      imports.wbg.__wbg_fetch_57429b87be3dcc33 = function(arg0) {
          const ret = fetch(getObject(arg0));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_log_56ad965dcd7a8d1e = function(arg0, arg1) {
          console.log(getStringFromWasm0(arg0, arg1));
      };
      imports.wbg.__wbg_warn_6b6312ae47b4000a = function(arg0, arg1) {
          console.warn(getStringFromWasm0(arg0, arg1));
      };
      imports.wbg.__wbg_error_d8f8bcfc5d63b5bb = function(arg0, arg1) {
          console.error(getStringFromWasm0(arg0, arg1));
      };
      imports.wbg.__wbg_indexedDB_839701fb576f779c = function() { return handleError(function (arg0) {
          const ret = getObject(arg0).indexedDB;
          return isLikeNone(ret) ? 0 : addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_setonabort_2b13e673d32df8bc = function(arg0, arg1) {
          getObject(arg0).onabort = getObject(arg1);
      };
      imports.wbg.__wbg_setoncomplete_97a83c9bfeb56eaf = function(arg0, arg1) {
          getObject(arg0).oncomplete = getObject(arg1);
      };
      imports.wbg.__wbg_setonerror_b7a755ab0647ce3e = function(arg0, arg1) {
          getObject(arg0).onerror = getObject(arg1);
      };
      imports.wbg.__wbg_objectStore_5a858a654147f96f = function() { return handleError(function (arg0, arg1, arg2) {
          const ret = getObject(arg0).objectStore(getStringFromWasm0(arg1, arg2));
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbindgen_number_new = function(arg0) {
          const ret = arg0;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_wasClean_74cf0c4d617e8bf5 = function(arg0) {
          const ret = getObject(arg0).wasClean;
          return ret;
      };
      imports.wbg.__wbg_code_858da7147ef5fb52 = function(arg0) {
          const ret = getObject(arg0).code;
          return ret;
      };
      imports.wbg.__wbg_reason_cab9df8d5ef57aa2 = function(arg0, arg1) {
          const ret = getObject(arg1).reason;
          const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len1 = WASM_VECTOR_LEN;
          getInt32Memory0()[arg0 / 4 + 1] = len1;
          getInt32Memory0()[arg0 / 4 + 0] = ptr1;
      };
      imports.wbg.__wbg_newwitheventinitdict_1f554ee93659ab92 = function() { return handleError(function (arg0, arg1, arg2) {
          const ret = new CloseEvent(getStringFromWasm0(arg0, arg1), getObject(arg2));
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_readyState_b25418fd198bf715 = function(arg0) {
          const ret = getObject(arg0).readyState;
          return ret;
      };
      imports.wbg.__wbg_setbinaryType_096c70c4a9d97499 = function(arg0, arg1) {
          getObject(arg0).binaryType = takeObject(arg1);
      };
      imports.wbg.__wbg_new_b66404b6322c59bf = function() { return handleError(function (arg0, arg1) {
          const ret = new WebSocket(getStringFromWasm0(arg0, arg1));
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_close_dfa389d8fddb52fc = function() { return handleError(function (arg0) {
          getObject(arg0).close();
      }, arguments) };
      imports.wbg.__wbg_send_280c8ab5d0df82de = function() { return handleError(function (arg0, arg1, arg2) {
          getObject(arg0).send(getStringFromWasm0(arg1, arg2));
      }, arguments) };
      imports.wbg.__wbg_send_1a008ea2eb3a1951 = function() { return handleError(function (arg0, arg1, arg2) {
          getObject(arg0).send(getArrayU8FromWasm0(arg1, arg2));
      }, arguments) };
      imports.wbg.__wbg_get_fc26906e5ae1ea85 = function() { return handleError(function (arg0, arg1) {
          const ret = getObject(arg0).get(getObject(arg1));
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_put_fb32824d87feec5c = function() { return handleError(function (arg0, arg1, arg2) {
          const ret = getObject(arg0).put(getObject(arg1), getObject(arg2));
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_setonversionchange_ee7f4abfb91cc81b = function(arg0, arg1) {
          getObject(arg0).onversionchange = getObject(arg1);
      };
      imports.wbg.__wbg_createObjectStore_40ad9287f7935c33 = function() { return handleError(function (arg0, arg1, arg2) {
          const ret = getObject(arg0).createObjectStore(getStringFromWasm0(arg1, arg2));
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_transaction_d6f1ef0b34b58a31 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
          const ret = getObject(arg0).transaction(getStringFromWasm0(arg1, arg2), takeObject(arg3));
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_newwithstrandinit_cad5cd6038c7ff5d = function() { return handleError(function (arg0, arg1, arg2) {
          const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_name_e1f42ed4f319b110 = function(arg0, arg1) {
          const ret = getObject(arg1).name;
          const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len1 = WASM_VECTOR_LEN;
          getInt32Memory0()[arg0 / 4 + 1] = len1;
          getInt32Memory0()[arg0 / 4 + 0] = ptr1;
      };
      imports.wbg.__wbg_message_ad3cc15a4d40c34b = function(arg0, arg1) {
          const ret = getObject(arg1).message;
          const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len1 = WASM_VECTOR_LEN;
          getInt32Memory0()[arg0 / 4 + 1] = len1;
          getInt32Memory0()[arg0 / 4 + 0] = ptr1;
      };
      imports.wbg.__wbg_code_e5bc0ed8fd7bc4b8 = function(arg0) {
          const ret = getObject(arg0).code;
          return ret;
      };
      imports.wbg.__wbg_new_1eead62f64ca15ce = function() { return handleError(function () {
          const ret = new Headers();
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_append_fda9e3432e3e88da = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
          getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
      }, arguments) };
      imports.wbg.__wbg_indexedDB_406f87676b363c82 = function() { return handleError(function (arg0) {
          const ret = getObject(arg0).indexedDB;
          return isLikeNone(ret) ? 0 : addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_fetch_8eaf01857a5bb21f = function(arg0, arg1) {
          const ret = getObject(arg0).fetch(getObject(arg1));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_open_6a08b03c958d4ad0 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
          const ret = getObject(arg0).open(getStringFromWasm0(arg1, arg2), arg3 >>> 0);
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_instanceof_Response_fc4327dbfcdf5ced = function(arg0) {
          let result;
          try {
              result = getObject(arg0) instanceof Response;
          } catch {
              result = false;
          }
          const ret = result;
          return ret;
      };
      imports.wbg.__wbg_url_8503de97f69da463 = function(arg0, arg1) {
          const ret = getObject(arg1).url;
          const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len1 = WASM_VECTOR_LEN;
          getInt32Memory0()[arg0 / 4 + 1] = len1;
          getInt32Memory0()[arg0 / 4 + 0] = ptr1;
      };
      imports.wbg.__wbg_status_ac85a3142a84caa2 = function(arg0) {
          const ret = getObject(arg0).status;
          return ret;
      };
      imports.wbg.__wbg_headers_b70de86b8e989bc0 = function(arg0) {
          const ret = getObject(arg0).headers;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_arrayBuffer_288fb3538806e85c = function() { return handleError(function (arg0) {
          const ret = getObject(arg0).arrayBuffer();
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_text_a667ac1770538491 = function() { return handleError(function (arg0) {
          const ret = getObject(arg0).text();
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_setonblocked_4311b52f166b3434 = function(arg0, arg1) {
          getObject(arg0).onblocked = getObject(arg1);
      };
      imports.wbg.__wbg_setonupgradeneeded_5a39a65558c323b2 = function(arg0, arg1) {
          getObject(arg0).onupgradeneeded = getObject(arg1);
      };
      imports.wbg.__wbg_result_edff16ff107d6acb = function() { return handleError(function (arg0) {
          const ret = getObject(arg0).result;
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_error_8a79f35fe9368563 = function() { return handleError(function (arg0) {
          const ret = getObject(arg0).error;
          return isLikeNone(ret) ? 0 : addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_readyState_a9f7376e6e642409 = function(arg0) {
          const ret = getObject(arg0).readyState;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_setonsuccess_f518a37d8228a576 = function(arg0, arg1) {
          getObject(arg0).onsuccess = getObject(arg1);
      };
      imports.wbg.__wbg_setonerror_7bf21979c5219792 = function(arg0, arg1) {
          getObject(arg0).onerror = getObject(arg1);
      };
      imports.wbg.__wbg_oldVersion_4fabc376deaf71d6 = function(arg0) {
          const ret = getObject(arg0).oldVersion;
          return ret;
      };
      imports.wbg.__wbg_data_ab99ae4a2e1e8bc9 = function(arg0) {
          const ret = getObject(arg0).data;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_target_f171e89c61e2bccf = function(arg0) {
          const ret = getObject(arg0).target;
          return isLikeNone(ret) ? 0 : addHeapObject(ret);
      };
      imports.wbg.__wbg_addEventListener_5651108fc3ffeb6e = function() { return handleError(function (arg0, arg1, arg2, arg3) {
          getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
      }, arguments) };
      imports.wbg.__wbg_addEventListener_a5963e26cd7b176b = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
          getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4));
      }, arguments) };
      imports.wbg.__wbg_dispatchEvent_a622a6455be582eb = function() { return handleError(function (arg0, arg1) {
          const ret = getObject(arg0).dispatchEvent(getObject(arg1));
          return ret;
      }, arguments) };
      imports.wbg.__wbg_removeEventListener_5de660c02ed784e4 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
          getObject(arg0).removeEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
      }, arguments) };
      imports.wbg.__wbg_signal_4bd18fb489af2d4c = function(arg0) {
          const ret = getObject(arg0).signal;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_new_55c9955722952374 = function() { return handleError(function () {
          const ret = new AbortController();
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_abort_654b796176d117aa = function(arg0) {
          getObject(arg0).abort();
      };
      imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
          const ret = getObject(arg0) == getObject(arg1);
          return ret;
      };
      imports.wbg.__wbg_getwithrefkey_5e6d9547403deab8 = function(arg0, arg1) {
          const ret = getObject(arg0)[getObject(arg1)];
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_set_841ac57cff3d672b = function(arg0, arg1, arg2) {
          getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
      };
      imports.wbg.__wbg_String_88810dfeb4021902 = function(arg0, arg1) {
          const ret = String(getObject(arg1));
          const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len1 = WASM_VECTOR_LEN;
          getInt32Memory0()[arg0 / 4 + 1] = len1;
          getInt32Memory0()[arg0 / 4 + 0] = ptr1;
      };
      imports.wbg.__wbg_randomFillSync_dc1e9a60c158336d = function() { return handleError(function (arg0, arg1) {
          getObject(arg0).randomFillSync(takeObject(arg1));
      }, arguments) };
      imports.wbg.__wbg_getRandomValues_37fa2ca9e4e07fab = function() { return handleError(function (arg0, arg1) {
          getObject(arg0).getRandomValues(getObject(arg1));
      }, arguments) };
      imports.wbg.__wbg_crypto_c48a774b022d20ac = function(arg0) {
          const ret = getObject(arg0).crypto;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_process_298734cf255a885d = function(arg0) {
          const ret = getObject(arg0).process;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_versions_e2e78e134e3e5d01 = function(arg0) {
          const ret = getObject(arg0).versions;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_node_1cd7a5d853dbea79 = function(arg0) {
          const ret = getObject(arg0).node;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_require_8f08ceecec0f4fee = function() { return handleError(function () {
          const ret = module.require;
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_msCrypto_bcb970640f50a1e8 = function(arg0) {
          const ret = getObject(arg0).msCrypto;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_self_7eede1f4488bf346 = function() { return handleError(function () {
          const ret = self.self;
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_crypto_c909fb428dcbddb6 = function(arg0) {
          const ret = getObject(arg0).crypto;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_msCrypto_511eefefbfc70ae4 = function(arg0) {
          const ret = getObject(arg0).msCrypto;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_require_900d5c3984fe7703 = function(arg0, arg1, arg2) {
          const ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_getRandomValues_307049345d0bd88c = function(arg0) {
          const ret = getObject(arg0).getRandomValues;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_getRandomValues_cd175915511f705e = function(arg0, arg1) {
          getObject(arg0).getRandomValues(getObject(arg1));
      };
      imports.wbg.__wbg_randomFillSync_85b3f4c52c56c313 = function(arg0, arg1, arg2) {
          getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
      };
      imports.wbg.__wbg_static_accessor_MODULE_ef3aa2eb251158a5 = function() {
          const ret = module;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_get_44be0491f933a435 = function(arg0, arg1) {
          const ret = getObject(arg0)[arg1 >>> 0];
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_length_fff51ee6522a1a18 = function(arg0) {
          const ret = getObject(arg0).length;
          return ret;
      };
      imports.wbg.__wbg_new_898a68150f225f2e = function() {
          const ret = new Array();
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_is_function = function(arg0) {
          const ret = typeof(getObject(arg0)) === 'function';
          return ret;
      };
      imports.wbg.__wbg_newnoargs_581967eacc0e2604 = function(arg0, arg1) {
          const ret = new Function(getStringFromWasm0(arg0, arg1));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_new_56693dbed0c32988 = function() {
          const ret = new Map();
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_next_526fc47e980da008 = function(arg0) {
          const ret = getObject(arg0).next;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_next_ddb3312ca1c4e32a = function() { return handleError(function (arg0) {
          const ret = getObject(arg0).next();
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_done_5c1f01fb660d73b5 = function(arg0) {
          const ret = getObject(arg0).done;
          return ret;
      };
      imports.wbg.__wbg_value_1695675138684bd5 = function(arg0) {
          const ret = getObject(arg0).value;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_iterator_97f0c81209c6c35a = function() {
          const ret = Symbol.iterator;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_get_97b561fb56f034b5 = function() { return handleError(function (arg0, arg1) {
          const ret = Reflect.get(getObject(arg0), getObject(arg1));
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_call_cb65541d95d71282 = function() { return handleError(function (arg0, arg1) {
          const ret = getObject(arg0).call(getObject(arg1));
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_new_b51585de1b234aff = function() {
          const ret = new Object();
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_self_1ff1d729e9aae938 = function() { return handleError(function () {
          const ret = self.self;
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_window_5f4faef6c12b79ec = function() { return handleError(function () {
          const ret = window.window;
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_globalThis_1d39714405582d3c = function() { return handleError(function () {
          const ret = globalThis.globalThis;
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_global_651f05c6a0944d1c = function() { return handleError(function () {
          const ret = global.global;
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_set_502d29070ea18557 = function(arg0, arg1, arg2) {
          getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
      };
      imports.wbg.__wbg_from_d7c216d4616bb368 = function(arg0) {
          const ret = Array.from(getObject(arg0));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_isArray_4c24b343cb13cfb1 = function(arg0) {
          const ret = Array.isArray(getObject(arg0));
          return ret;
      };
      imports.wbg.__wbg_instanceof_ArrayBuffer_39ac22089b74fddb = function(arg0) {
          let result;
          try {
              result = getObject(arg0) instanceof ArrayBuffer;
          } catch {
              result = false;
          }
          const ret = result;
          return ret;
      };
      imports.wbg.__wbg_instanceof_Error_ab19e20608ea43c7 = function(arg0) {
          let result;
          try {
              result = getObject(arg0) instanceof Error;
          } catch {
              result = false;
          }
          const ret = result;
          return ret;
      };
      imports.wbg.__wbg_new_d258248ed531ff54 = function(arg0, arg1) {
          const ret = new Error(getStringFromWasm0(arg0, arg1));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_message_48bacc5ea57d74ee = function(arg0) {
          const ret = getObject(arg0).message;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_name_8f734cbbd6194153 = function(arg0) {
          const ret = getObject(arg0).name;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_toString_1c056108b87ba68b = function(arg0) {
          const ret = getObject(arg0).toString();
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_call_01734de55d61e11d = function() { return handleError(function (arg0, arg1, arg2) {
          const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_set_bedc3d02d0f05eb0 = function(arg0, arg1, arg2) {
          const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_isSafeInteger_bb8e18dd21c97288 = function(arg0) {
          const ret = Number.isSafeInteger(getObject(arg0));
          return ret;
      };
      imports.wbg.__wbg_getTime_5e2054f832d82ec9 = function(arg0) {
          const ret = getObject(arg0).getTime();
          return ret;
      };
      imports.wbg.__wbg_new0_c0be7df4b6bd481f = function() {
          const ret = new Date();
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_entries_e51f29c7bba0c054 = function(arg0) {
          const ret = Object.entries(getObject(arg0));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_new_43f1b47c28813cbd = function(arg0, arg1) {
          try {
              var state0 = {a: arg0, b: arg1};
              var cb0 = (arg0, arg1) => {
                  const a = state0.a;
                  state0.a = 0;
                  try {
                      return __wbg_adapter_407(a, state0.b, arg0, arg1);
                  } finally {
                      state0.a = a;
                  }
              };
              const ret = new Promise(cb0);
              return addHeapObject(ret);
          } finally {
              state0.a = state0.b = 0;
          }
      };
      imports.wbg.__wbg_reject_7bd6ac9617013c02 = function(arg0) {
          const ret = Promise.reject(getObject(arg0));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_resolve_53698b95aaf7fcf8 = function(arg0) {
          const ret = Promise.resolve(getObject(arg0));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_then_f7e06ee3c11698eb = function(arg0, arg1) {
          const ret = getObject(arg0).then(getObject(arg1));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_then_b2267541e2a73865 = function(arg0, arg1, arg2) {
          const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_buffer_085ec1f694018c4f = function(arg0) {
          const ret = getObject(arg0).buffer;
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_newwithbyteoffsetandlength_6da8e527659b86aa = function(arg0, arg1, arg2) {
          const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_new_8125e318e6245eed = function(arg0) {
          const ret = new Uint8Array(getObject(arg0));
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_set_5cf90238115182c3 = function(arg0, arg1, arg2) {
          getObject(arg0).set(getObject(arg1), arg2 >>> 0);
      };
      imports.wbg.__wbg_length_72e2208bbc0efc61 = function(arg0) {
          const ret = getObject(arg0).length;
          return ret;
      };
      imports.wbg.__wbg_instanceof_Uint8Array_d8d9cb2b8e8ac1d4 = function(arg0) {
          let result;
          try {
              result = getObject(arg0) instanceof Uint8Array;
          } catch {
              result = false;
          }
          const ret = result;
          return ret;
      };
      imports.wbg.__wbg_newwithlength_e5d69174d6984cd7 = function(arg0) {
          const ret = new Uint8Array(arg0 >>> 0);
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_subarray_13db269f57aa838d = function(arg0, arg1, arg2) {
          const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
          return addHeapObject(ret);
      };
      imports.wbg.__wbg_stringify_e25465938f3f611f = function() { return handleError(function (arg0) {
          const ret = JSON.stringify(getObject(arg0));
          return addHeapObject(ret);
      }, arguments) };
      imports.wbg.__wbg_has_c5fcd020291e56b8 = function() { return handleError(function (arg0, arg1) {
          const ret = Reflect.has(getObject(arg0), getObject(arg1));
          return ret;
      }, arguments) };
      imports.wbg.__wbg_set_092e06b0f9d71865 = function() { return handleError(function (arg0, arg1, arg2) {
          const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
          return ret;
      }, arguments) };
      imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
          const v = getObject(arg1);
          const ret = typeof(v) === 'bigint' ? v : undefined;
          getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
          getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
      };
      imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
          const ret = debugString(getObject(arg1));
          const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len1 = WASM_VECTOR_LEN;
          getInt32Memory0()[arg0 / 4 + 1] = len1;
          getInt32Memory0()[arg0 / 4 + 0] = ptr1;
      };
      imports.wbg.__wbindgen_throw = function(arg0, arg1) {
          throw new Error(getStringFromWasm0(arg0, arg1));
      };
      imports.wbg.__wbindgen_memory = function() {
          const ret = wasm.memory;
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_closure_wrapper2248 = function(arg0, arg1, arg2) {
          const ret = makeMutClosure(arg0, arg1, 328, __wbg_adapter_48);
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_closure_wrapper2928 = function(arg0, arg1, arg2) {
          const ret = makeClosure(arg0, arg1, 577, __wbg_adapter_51);
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_closure_wrapper2930 = function(arg0, arg1, arg2) {
          const ret = makeClosure(arg0, arg1, 577, __wbg_adapter_54);
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_closure_wrapper4429 = function(arg0, arg1, arg2) {
          const ret = makeMutClosure(arg0, arg1, 841, __wbg_adapter_57);
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_closure_wrapper5493 = function(arg0, arg1, arg2) {
          const ret = makeMutClosure(arg0, arg1, 1240, __wbg_adapter_60);
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_closure_wrapper7394 = function(arg0, arg1, arg2) {
          const ret = makeMutClosure(arg0, arg1, 1822, __wbg_adapter_63);
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_closure_wrapper7396 = function(arg0, arg1, arg2) {
          const ret = makeMutClosure(arg0, arg1, 1822, __wbg_adapter_63);
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_closure_wrapper7398 = function(arg0, arg1, arg2) {
          const ret = makeMutClosure(arg0, arg1, 1822, __wbg_adapter_63);
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_closure_wrapper7400 = function(arg0, arg1, arg2) {
          const ret = makeMutClosure(arg0, arg1, 1822, __wbg_adapter_70);
          return addHeapObject(ret);
      };
      imports.wbg.__wbindgen_closure_wrapper7458 = function(arg0, arg1, arg2) {
          const ret = makeMutClosure(arg0, arg1, 1847, __wbg_adapter_73);
          return addHeapObject(ret);
      };

      return imports;
  }

  function __wbg_finalize_init(instance, module) {
      wasm = instance.exports;
      __wbg_init.__wbindgen_wasm_module = module;
      cachedBigInt64Memory0 = null;
      cachedFloat64Memory0 = null;
      cachedInt32Memory0 = null;
      cachedUint8Memory0 = null;

      wasm.__wbindgen_start();
      return wasm;
  }

  async function __wbg_init(input) {
      if (wasm !== undefined) return wasm;

      if (typeof input === 'undefined') {
          input = undefined;
      }
      const imports = __wbg_get_imports();

      if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
          input = fetch(input);
      }

      const { instance, module } = await __wbg_load(await input, imports);

      return __wbg_finalize_init(instance, module);
  }

  // Copyright 2018 The Go Authors. All rights reserved.
  // Use of this source code is governed by a BSD-style
  // license that can be found in the LICENSE file.


  (() => {
  	const enosys = () => {
  		const err = new Error("not implemented");
  		err.code = "ENOSYS";
  		return err;
  	};

  	if (!globalThis.fs) {
  		let outputBuf = "";
  		globalThis.fs = {
  			constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1 }, // unused
  			writeSync(fd, buf) {
  				outputBuf += decoder.decode(buf);
  				const nl = outputBuf.lastIndexOf("\n");
  				if (nl != -1) {
  					console.log(outputBuf.substring(0, nl));
  					outputBuf = outputBuf.substring(nl + 1);
  				}
  				return buf.length;
  			},
  			write(fd, buf, offset, length, position, callback) {
  				if (offset !== 0 || length !== buf.length || position !== null) {
  					callback(enosys());
  					return;
  				}
  				const n = this.writeSync(fd, buf);
  				callback(null, n);
  			},
  			chmod(path, mode, callback) { callback(enosys()); },
  			chown(path, uid, gid, callback) { callback(enosys()); },
  			close(fd, callback) { callback(enosys()); },
  			fchmod(fd, mode, callback) { callback(enosys()); },
  			fchown(fd, uid, gid, callback) { callback(enosys()); },
  			fstat(fd, callback) { callback(enosys()); },
  			fsync(fd, callback) { callback(null); },
  			ftruncate(fd, length, callback) { callback(enosys()); },
  			lchown(path, uid, gid, callback) { callback(enosys()); },
  			link(path, link, callback) { callback(enosys()); },
  			lstat(path, callback) { callback(enosys()); },
  			mkdir(path, perm, callback) { callback(enosys()); },
  			open(path, flags, mode, callback) { callback(enosys()); },
  			read(fd, buffer, offset, length, position, callback) { callback(enosys()); },
  			readdir(path, callback) { callback(enosys()); },
  			readlink(path, callback) { callback(enosys()); },
  			rename(from, to, callback) { callback(enosys()); },
  			rmdir(path, callback) { callback(enosys()); },
  			stat(path, callback) { callback(enosys()); },
  			symlink(path, link, callback) { callback(enosys()); },
  			truncate(path, length, callback) { callback(enosys()); },
  			unlink(path, callback) { callback(enosys()); },
  			utimes(path, atime, mtime, callback) { callback(enosys()); },
  		};
  	}

  	if (!globalThis.process) {
  		globalThis.process = {
  			getuid() { return -1; },
  			getgid() { return -1; },
  			geteuid() { return -1; },
  			getegid() { return -1; },
  			getgroups() { throw enosys(); },
  			pid: -1,
  			ppid: -1,
  			umask() { throw enosys(); },
  			cwd() { throw enosys(); },
  			chdir() { throw enosys(); },
  		};
  	}

  	if (!globalThis.crypto) {
  		throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");
  	}

  	if (!globalThis.performance) {
  		throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");
  	}

  	if (!globalThis.TextEncoder) {
  		throw new Error("globalThis.TextEncoder is not available, polyfill required");
  	}

  	if (!globalThis.TextDecoder) {
  		throw new Error("globalThis.TextDecoder is not available, polyfill required");
  	}

  	const encoder = new TextEncoder("utf-8");
  	const decoder = new TextDecoder("utf-8");

  	globalThis.Go = class {
  		constructor() {
  			this.argv = ["js"];
  			this.env = {};
  			this.exit = (code) => {
  				if (code !== 0) {
  					console.warn("exit code:", code);
  				}
  			};
  			this._exitPromise = new Promise((resolve) => {
  				this._resolveExitPromise = resolve;
  			});
  			this._pendingEvent = null;
  			this._scheduledTimeouts = new Map();
  			this._nextCallbackTimeoutID = 1;

  			const setInt64 = (addr, v) => {
  				this.mem.setUint32(addr + 0, v, true);
  				this.mem.setUint32(addr + 4, Math.floor(v / 4294967296), true);
  			};

  			const getInt64 = (addr) => {
  				const low = this.mem.getUint32(addr + 0, true);
  				const high = this.mem.getInt32(addr + 4, true);
  				return low + high * 4294967296;
  			};

  			const loadValue = (addr) => {
  				const f = this.mem.getFloat64(addr, true);
  				if (f === 0) {
  					return undefined;
  				}
  				if (!isNaN(f)) {
  					return f;
  				}

  				const id = this.mem.getUint32(addr, true);
  				return this._values[id];
  			};

  			const storeValue = (addr, v) => {
  				const nanHead = 0x7FF80000;

  				if (typeof v === "number" && v !== 0) {
  					if (isNaN(v)) {
  						this.mem.setUint32(addr + 4, nanHead, true);
  						this.mem.setUint32(addr, 0, true);
  						return;
  					}
  					this.mem.setFloat64(addr, v, true);
  					return;
  				}

  				if (v === undefined) {
  					this.mem.setFloat64(addr, 0, true);
  					return;
  				}

  				let id = this._ids.get(v);
  				if (id === undefined) {
  					id = this._idPool.pop();
  					if (id === undefined) {
  						id = this._values.length;
  					}
  					this._values[id] = v;
  					this._goRefCounts[id] = 0;
  					this._ids.set(v, id);
  				}
  				this._goRefCounts[id]++;
  				let typeFlag = 0;
  				switch (typeof v) {
  					case "object":
  						if (v !== null) {
  							typeFlag = 1;
  						}
  						break;
  					case "string":
  						typeFlag = 2;
  						break;
  					case "symbol":
  						typeFlag = 3;
  						break;
  					case "function":
  						typeFlag = 4;
  						break;
  				}
  				this.mem.setUint32(addr + 4, nanHead | typeFlag, true);
  				this.mem.setUint32(addr, id, true);
  			};

  			const loadSlice = (addr) => {
  				const array = getInt64(addr + 0);
  				const len = getInt64(addr + 8);
  				return new Uint8Array(this._inst.exports.mem.buffer, array, len);
  			};

  			const loadSliceOfValues = (addr) => {
  				const array = getInt64(addr + 0);
  				const len = getInt64(addr + 8);
  				const a = new Array(len);
  				for (let i = 0; i < len; i++) {
  					a[i] = loadValue(array + i * 8);
  				}
  				return a;
  			};

  			const loadString = (addr) => {
  				const saddr = getInt64(addr + 0);
  				const len = getInt64(addr + 8);
  				return decoder.decode(new DataView(this._inst.exports.mem.buffer, saddr, len));
  			};

  			const timeOrigin = Date.now() - performance.now();
  			this.importObject = {
  				go: {
  					// Go's SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)
  					// may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported
  					// function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).
  					// This changes the SP, thus we have to update the SP used by the imported function.

  					// func wasmExit(code int32)
  					"runtime.wasmExit": (sp) => {
  						sp >>>= 0;
  						const code = this.mem.getInt32(sp + 8, true);
  						this.exited = true;
  						delete this._inst;
  						delete this._values;
  						delete this._goRefCounts;
  						delete this._ids;
  						delete this._idPool;
  						this.exit(code);
  					},

  					// func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
  					"runtime.wasmWrite": (sp) => {
  						sp >>>= 0;
  						const fd = getInt64(sp + 8);
  						const p = getInt64(sp + 16);
  						const n = this.mem.getInt32(sp + 24, true);
  						fs.writeSync(fd, new Uint8Array(this._inst.exports.mem.buffer, p, n));
  					},

  					// func resetMemoryDataView()
  					"runtime.resetMemoryDataView": (sp) => {
  						this.mem = new DataView(this._inst.exports.mem.buffer);
  					},

  					// func nanotime1() int64
  					"runtime.nanotime1": (sp) => {
  						sp >>>= 0;
  						setInt64(sp + 8, (timeOrigin + performance.now()) * 1000000);
  					},

  					// func walltime() (sec int64, nsec int32)
  					"runtime.walltime": (sp) => {
  						sp >>>= 0;
  						const msec = (new Date).getTime();
  						setInt64(sp + 8, msec / 1000);
  						this.mem.setInt32(sp + 16, (msec % 1000) * 1000000, true);
  					},

  					// func scheduleTimeoutEvent(delay int64) int32
  					"runtime.scheduleTimeoutEvent": (sp) => {
  						sp >>>= 0;
  						const id = this._nextCallbackTimeoutID;
  						this._nextCallbackTimeoutID++;
  						this._scheduledTimeouts.set(id, setTimeout(
  							() => {
  								this._resume();
  								while (this._scheduledTimeouts.has(id)) {
  									// for some reason Go failed to register the timeout event, log and try again
  									// (temporary workaround for https://github.com/golang/go/issues/28975)
  									console.warn("scheduleTimeoutEvent: missed timeout event");
  									this._resume();
  								}
  							},
  							getInt64(sp + 8) + 1, // setTimeout has been seen to fire up to 1 millisecond early
  						));
  						this.mem.setInt32(sp + 16, id, true);
  					},

  					// func clearTimeoutEvent(id int32)
  					"runtime.clearTimeoutEvent": (sp) => {
  						sp >>>= 0;
  						const id = this.mem.getInt32(sp + 8, true);
  						clearTimeout(this._scheduledTimeouts.get(id));
  						this._scheduledTimeouts.delete(id);
  					},

  					// func getRandomData(r []byte)
  					"runtime.getRandomData": (sp) => {
  						sp >>>= 0;
  						crypto.getRandomValues(loadSlice(sp + 8));
  					},

  					// func finalizeRef(v ref)
  					"syscall/js.finalizeRef": (sp) => {
  						sp >>>= 0;
  						const id = this.mem.getUint32(sp + 8, true);
  						this._goRefCounts[id]--;
  						if (this._goRefCounts[id] === 0) {
  							const v = this._values[id];
  							this._values[id] = null;
  							this._ids.delete(v);
  							this._idPool.push(id);
  						}
  					},

  					// func stringVal(value string) ref
  					"syscall/js.stringVal": (sp) => {
  						sp >>>= 0;
  						storeValue(sp + 24, loadString(sp + 8));
  					},

  					// func valueGet(v ref, p string) ref
  					"syscall/js.valueGet": (sp) => {
  						sp >>>= 0;
  						const result = Reflect.get(loadValue(sp + 8), loadString(sp + 16));
  						sp = this._inst.exports.getsp() >>> 0; // see comment above
  						storeValue(sp + 32, result);
  					},

  					// func valueSet(v ref, p string, x ref)
  					"syscall/js.valueSet": (sp) => {
  						sp >>>= 0;
  						Reflect.set(loadValue(sp + 8), loadString(sp + 16), loadValue(sp + 32));
  					},

  					// func valueDelete(v ref, p string)
  					"syscall/js.valueDelete": (sp) => {
  						sp >>>= 0;
  						Reflect.deleteProperty(loadValue(sp + 8), loadString(sp + 16));
  					},

  					// func valueIndex(v ref, i int) ref
  					"syscall/js.valueIndex": (sp) => {
  						sp >>>= 0;
  						storeValue(sp + 24, Reflect.get(loadValue(sp + 8), getInt64(sp + 16)));
  					},

  					// valueSetIndex(v ref, i int, x ref)
  					"syscall/js.valueSetIndex": (sp) => {
  						sp >>>= 0;
  						Reflect.set(loadValue(sp + 8), getInt64(sp + 16), loadValue(sp + 24));
  					},

  					// func valueCall(v ref, m string, args []ref) (ref, bool)
  					"syscall/js.valueCall": (sp) => {
  						sp >>>= 0;
  						try {
  							const v = loadValue(sp + 8);
  							const m = Reflect.get(v, loadString(sp + 16));
  							const args = loadSliceOfValues(sp + 32);
  							const result = Reflect.apply(m, v, args);
  							sp = this._inst.exports.getsp() >>> 0; // see comment above
  							storeValue(sp + 56, result);
  							this.mem.setUint8(sp + 64, 1);
  						} catch (err) {
  							sp = this._inst.exports.getsp() >>> 0; // see comment above
  							storeValue(sp + 56, err);
  							this.mem.setUint8(sp + 64, 0);
  						}
  					},

  					// func valueInvoke(v ref, args []ref) (ref, bool)
  					"syscall/js.valueInvoke": (sp) => {
  						sp >>>= 0;
  						try {
  							const v = loadValue(sp + 8);
  							const args = loadSliceOfValues(sp + 16);
  							const result = Reflect.apply(v, undefined, args);
  							sp = this._inst.exports.getsp() >>> 0; // see comment above
  							storeValue(sp + 40, result);
  							this.mem.setUint8(sp + 48, 1);
  						} catch (err) {
  							sp = this._inst.exports.getsp() >>> 0; // see comment above
  							storeValue(sp + 40, err);
  							this.mem.setUint8(sp + 48, 0);
  						}
  					},

  					// func valueNew(v ref, args []ref) (ref, bool)
  					"syscall/js.valueNew": (sp) => {
  						sp >>>= 0;
  						try {
  							const v = loadValue(sp + 8);
  							const args = loadSliceOfValues(sp + 16);
  							const result = Reflect.construct(v, args);
  							sp = this._inst.exports.getsp() >>> 0; // see comment above
  							storeValue(sp + 40, result);
  							this.mem.setUint8(sp + 48, 1);
  						} catch (err) {
  							sp = this._inst.exports.getsp() >>> 0; // see comment above
  							storeValue(sp + 40, err);
  							this.mem.setUint8(sp + 48, 0);
  						}
  					},

  					// func valueLength(v ref) int
  					"syscall/js.valueLength": (sp) => {
  						sp >>>= 0;
  						setInt64(sp + 16, parseInt(loadValue(sp + 8).length));
  					},

  					// valuePrepareString(v ref) (ref, int)
  					"syscall/js.valuePrepareString": (sp) => {
  						sp >>>= 0;
  						const str = encoder.encode(String(loadValue(sp + 8)));
  						storeValue(sp + 16, str);
  						setInt64(sp + 24, str.length);
  					},

  					// valueLoadString(v ref, b []byte)
  					"syscall/js.valueLoadString": (sp) => {
  						sp >>>= 0;
  						const str = loadValue(sp + 8);
  						loadSlice(sp + 16).set(str);
  					},

  					// func valueInstanceOf(v ref, t ref) bool
  					"syscall/js.valueInstanceOf": (sp) => {
  						sp >>>= 0;
  						this.mem.setUint8(sp + 24, (loadValue(sp + 8) instanceof loadValue(sp + 16)) ? 1 : 0);
  					},

  					// func copyBytesToGo(dst []byte, src ref) (int, bool)
  					"syscall/js.copyBytesToGo": (sp) => {
  						sp >>>= 0;
  						const dst = loadSlice(sp + 8);
  						const src = loadValue(sp + 32);
  						if (!(src instanceof Uint8Array || src instanceof Uint8ClampedArray)) {
  							this.mem.setUint8(sp + 48, 0);
  							return;
  						}
  						const toCopy = src.subarray(0, dst.length);
  						dst.set(toCopy);
  						setInt64(sp + 40, toCopy.length);
  						this.mem.setUint8(sp + 48, 1);
  					},

  					// func copyBytesToJS(dst ref, src []byte) (int, bool)
  					"syscall/js.copyBytesToJS": (sp) => {
  						sp >>>= 0;
  						const dst = loadValue(sp + 8);
  						const src = loadSlice(sp + 16);
  						if (!(dst instanceof Uint8Array || dst instanceof Uint8ClampedArray)) {
  							this.mem.setUint8(sp + 48, 0);
  							return;
  						}
  						const toCopy = src.subarray(0, dst.length);
  						dst.set(toCopy);
  						setInt64(sp + 40, toCopy.length);
  						this.mem.setUint8(sp + 48, 1);
  					},

  					"debug": (value) => {
  						console.log(value);
  					},
  				}
  			};
  		}

  		async run(instance) {
  			if (!(instance instanceof WebAssembly.Instance)) {
  				throw new Error("Go.run: WebAssembly.Instance expected");
  			}
  			this._inst = instance;
  			this.mem = new DataView(this._inst.exports.mem.buffer);
  			this._values = [ // JS values that Go currently has references to, indexed by reference id
  				NaN,
  				0,
  				null,
  				true,
  				false,
  				globalThis,
  				this,
  			];
  			this._goRefCounts = new Array(this._values.length).fill(Infinity); // number of references that Go has to a JS value, indexed by reference id
  			this._ids = new Map([ // mapping from JS values to reference ids
  				[0, 1],
  				[null, 2],
  				[true, 3],
  				[false, 4],
  				[globalThis, 5],
  				[this, 6],
  			]);
  			this._idPool = [];   // unused ids that have been garbage collected
  			this.exited = false; // whether the Go program has exited

  			// Pass command line arguments and environment variables to WebAssembly by writing them to the linear memory.
  			let offset = 4096;

  			const strPtr = (str) => {
  				const ptr = offset;
  				const bytes = encoder.encode(str + "\0");
  				new Uint8Array(this.mem.buffer, offset, bytes.length).set(bytes);
  				offset += bytes.length;
  				if (offset % 8 !== 0) {
  					offset += 8 - (offset % 8);
  				}
  				return ptr;
  			};

  			const argc = this.argv.length;

  			const argvPtrs = [];
  			this.argv.forEach((arg) => {
  				argvPtrs.push(strPtr(arg));
  			});
  			argvPtrs.push(0);

  			const keys = Object.keys(this.env).sort();
  			keys.forEach((key) => {
  				argvPtrs.push(strPtr(`${key}=${this.env[key]}`));
  			});
  			argvPtrs.push(0);

  			const argv = offset;
  			argvPtrs.forEach((ptr) => {
  				this.mem.setUint32(offset, ptr, true);
  				this.mem.setUint32(offset + 4, 0, true);
  				offset += 8;
  			});

  			// The linker guarantees global data starts from at least wasmMinDataAddr.
  			// Keep in sync with cmd/link/internal/ld/data.go:wasmMinDataAddr.
  			const wasmMinDataAddr = 4096 + 8192;
  			if (offset >= wasmMinDataAddr) {
  				throw new Error("total length of command line and environment variables exceeds limit");
  			}

  			this._inst.exports.run(argc, argv);
  			if (this.exited) {
  				this._resolveExitPromise();
  			}
  			await this._exitPromise;
  		}

  		_resume() {
  			if (this.exited) {
  				throw new Error("Go program has already exited");
  			}
  			this._inst.exports.resume();
  			if (this.exited) {
  				this._resolveExitPromise();
  			}
  		}

  		_makeFuncWrapper(id) {
  			const go = this;
  			return function () {
  				const event = { id: id, this: this, args: arguments };
  				go._pendingEvent = event;
  				go._resume();
  				return event.result;
  			};
  		}
  	};
  })();

  /* eslint-disable @typescript-eslint/naming-convention,no-restricted-globals */
  /// <reference types="@nymproject/mix-fetch-wasm" />
  function loadGoWasm() {
      return __awaiter(this, void 0, void 0, function* () {
          // rollup will provide a function to get the Go connection WASM bytes here
          const bytes = yield getGoConnectionWasmBytes();
          // @ts-ignore
          const go = new Go(); // Defined in wasm_exec.js
          // the WebAssembly runtime will parse the bytes and then start the Go runtime
          const wasmObj = yield WebAssembly.instantiate(bytes, go.importObject);
          go.run(wasmObj);
      });
  }
  function setupRsGoBridge() {
      const rsGoBridge = {
          send_client_data,
          start_new_mixnet_connection,
          mix_fetch_initialised,
          finish_mixnet_connection,
      };
      // (note: reason for intermediate `__rs_go_bridge__` object is to decrease global scope bloat
      // and to discourage users from trying to call those methods directly)
      // eslint-disable-next-line no-underscore-dangle
      self.__rs_go_bridge__ = rsGoBridge;
  }
  function loadWasm() {
      return __awaiter(this, void 0, void 0, function* () {
          // rollup with provide a function to get the mixFetch WASM bytes
          const bytes = yield getMixFetchWasmBytes();
          // load rust WASM package
          yield __wbg_init(bytes);
          console.log('Loaded RUST WASM');
          // load go WASM package
          yield loadGoWasm();
          console.log('Loaded GO WASM');
          // sets up better stack traces in case of in-rust panics
          set_panic_hook();
          setupRsGoBridge();
          // goWasmSetLogging('trace');
      });
  }

  /**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   */
  const proxyMarker = Symbol("Comlink.proxy");
  const createEndpoint = Symbol("Comlink.endpoint");
  const releaseProxy = Symbol("Comlink.releaseProxy");
  const finalizer = Symbol("Comlink.finalizer");
  const throwMarker = Symbol("Comlink.thrown");
  const isObject = (val) => (typeof val === "object" && val !== null) || typeof val === "function";
  /**
   * Internal transfer handle to handle objects marked to proxy.
   */
  const proxyTransferHandler = {
      canHandle: (val) => isObject(val) && val[proxyMarker],
      serialize(obj) {
          const { port1, port2 } = new MessageChannel();
          expose(obj, port1);
          return [port2, [port2]];
      },
      deserialize(port) {
          port.start();
          return wrap(port);
      },
  };
  /**
   * Internal transfer handler to handle thrown exceptions.
   */
  const throwTransferHandler = {
      canHandle: (value) => isObject(value) && throwMarker in value,
      serialize({ value }) {
          let serialized;
          if (value instanceof Error) {
              serialized = {
                  isError: true,
                  value: {
                      message: value.message,
                      name: value.name,
                      stack: value.stack,
                  },
              };
          }
          else {
              serialized = { isError: false, value };
          }
          return [serialized, []];
      },
      deserialize(serialized) {
          if (serialized.isError) {
              throw Object.assign(new Error(serialized.value.message), serialized.value);
          }
          throw serialized.value;
      },
  };
  /**
   * Allows customizing the serialization of certain values.
   */
  const transferHandlers = new Map([
      ["proxy", proxyTransferHandler],
      ["throw", throwTransferHandler],
  ]);
  function isAllowedOrigin(allowedOrigins, origin) {
      for (const allowedOrigin of allowedOrigins) {
          if (origin === allowedOrigin || allowedOrigin === "*") {
              return true;
          }
          if (allowedOrigin instanceof RegExp && allowedOrigin.test(origin)) {
              return true;
          }
      }
      return false;
  }
  function expose(obj, ep = globalThis, allowedOrigins = ["*"]) {
      ep.addEventListener("message", function callback(ev) {
          if (!ev || !ev.data) {
              return;
          }
          if (!isAllowedOrigin(allowedOrigins, ev.origin)) {
              console.warn(`Invalid origin '${ev.origin}' for comlink proxy`);
              return;
          }
          const { id, type, path } = Object.assign({ path: [] }, ev.data);
          const argumentList = (ev.data.argumentList || []).map(fromWireValue);
          let returnValue;
          try {
              const parent = path.slice(0, -1).reduce((obj, prop) => obj[prop], obj);
              const rawValue = path.reduce((obj, prop) => obj[prop], obj);
              switch (type) {
                  case "GET" /* MessageType.GET */:
                      {
                          returnValue = rawValue;
                      }
                      break;
                  case "SET" /* MessageType.SET */:
                      {
                          parent[path.slice(-1)[0]] = fromWireValue(ev.data.value);
                          returnValue = true;
                      }
                      break;
                  case "APPLY" /* MessageType.APPLY */:
                      {
                          returnValue = rawValue.apply(parent, argumentList);
                      }
                      break;
                  case "CONSTRUCT" /* MessageType.CONSTRUCT */:
                      {
                          const value = new rawValue(...argumentList);
                          returnValue = proxy(value);
                      }
                      break;
                  case "ENDPOINT" /* MessageType.ENDPOINT */:
                      {
                          const { port1, port2 } = new MessageChannel();
                          expose(obj, port2);
                          returnValue = transfer(port1, [port1]);
                      }
                      break;
                  case "RELEASE" /* MessageType.RELEASE */:
                      {
                          returnValue = undefined;
                      }
                      break;
                  default:
                      return;
              }
          }
          catch (value) {
              returnValue = { value, [throwMarker]: 0 };
          }
          Promise.resolve(returnValue)
              .catch((value) => {
              return { value, [throwMarker]: 0 };
          })
              .then((returnValue) => {
              const [wireValue, transferables] = toWireValue(returnValue);
              ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
              if (type === "RELEASE" /* MessageType.RELEASE */) {
                  // detach and deactive after sending release response above.
                  ep.removeEventListener("message", callback);
                  closeEndPoint(ep);
                  if (finalizer in obj && typeof obj[finalizer] === "function") {
                      obj[finalizer]();
                  }
              }
          })
              .catch((error) => {
              // Send Serialization Error To Caller
              const [wireValue, transferables] = toWireValue({
                  value: new TypeError("Unserializable return value"),
                  [throwMarker]: 0,
              });
              ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
          });
      });
      if (ep.start) {
          ep.start();
      }
  }
  function isMessagePort(endpoint) {
      return endpoint.constructor.name === "MessagePort";
  }
  function closeEndPoint(endpoint) {
      if (isMessagePort(endpoint))
          endpoint.close();
  }
  function wrap(ep, target) {
      return createProxy(ep, [], target);
  }
  function throwIfProxyReleased(isReleased) {
      if (isReleased) {
          throw new Error("Proxy has been released and is not useable");
      }
  }
  function releaseEndpoint(ep) {
      return requestResponseMessage(ep, {
          type: "RELEASE" /* MessageType.RELEASE */,
      }).then(() => {
          closeEndPoint(ep);
      });
  }
  const proxyCounter = new WeakMap();
  const proxyFinalizers = "FinalizationRegistry" in globalThis &&
      new FinalizationRegistry((ep) => {
          const newCount = (proxyCounter.get(ep) || 0) - 1;
          proxyCounter.set(ep, newCount);
          if (newCount === 0) {
              releaseEndpoint(ep);
          }
      });
  function registerProxy(proxy, ep) {
      const newCount = (proxyCounter.get(ep) || 0) + 1;
      proxyCounter.set(ep, newCount);
      if (proxyFinalizers) {
          proxyFinalizers.register(proxy, ep, proxy);
      }
  }
  function unregisterProxy(proxy) {
      if (proxyFinalizers) {
          proxyFinalizers.unregister(proxy);
      }
  }
  function createProxy(ep, path = [], target = function () { }) {
      let isProxyReleased = false;
      const proxy = new Proxy(target, {
          get(_target, prop) {
              throwIfProxyReleased(isProxyReleased);
              if (prop === releaseProxy) {
                  return () => {
                      unregisterProxy(proxy);
                      releaseEndpoint(ep);
                      isProxyReleased = true;
                  };
              }
              if (prop === "then") {
                  if (path.length === 0) {
                      return { then: () => proxy };
                  }
                  const r = requestResponseMessage(ep, {
                      type: "GET" /* MessageType.GET */,
                      path: path.map((p) => p.toString()),
                  }).then(fromWireValue);
                  return r.then.bind(r);
              }
              return createProxy(ep, [...path, prop]);
          },
          set(_target, prop, rawValue) {
              throwIfProxyReleased(isProxyReleased);
              // FIXME: ES6 Proxy Handler `set` methods are supposed to return a
              // boolean. To show good will, we return true asynchronously ¯\_(ツ)_/¯
              const [value, transferables] = toWireValue(rawValue);
              return requestResponseMessage(ep, {
                  type: "SET" /* MessageType.SET */,
                  path: [...path, prop].map((p) => p.toString()),
                  value,
              }, transferables).then(fromWireValue);
          },
          apply(_target, _thisArg, rawArgumentList) {
              throwIfProxyReleased(isProxyReleased);
              const last = path[path.length - 1];
              if (last === createEndpoint) {
                  return requestResponseMessage(ep, {
                      type: "ENDPOINT" /* MessageType.ENDPOINT */,
                  }).then(fromWireValue);
              }
              // We just pretend that `bind()` didn’t happen.
              if (last === "bind") {
                  return createProxy(ep, path.slice(0, -1));
              }
              const [argumentList, transferables] = processArguments(rawArgumentList);
              return requestResponseMessage(ep, {
                  type: "APPLY" /* MessageType.APPLY */,
                  path: path.map((p) => p.toString()),
                  argumentList,
              }, transferables).then(fromWireValue);
          },
          construct(_target, rawArgumentList) {
              throwIfProxyReleased(isProxyReleased);
              const [argumentList, transferables] = processArguments(rawArgumentList);
              return requestResponseMessage(ep, {
                  type: "CONSTRUCT" /* MessageType.CONSTRUCT */,
                  path: path.map((p) => p.toString()),
                  argumentList,
              }, transferables).then(fromWireValue);
          },
      });
      registerProxy(proxy, ep);
      return proxy;
  }
  function myFlat(arr) {
      return Array.prototype.concat.apply([], arr);
  }
  function processArguments(argumentList) {
      const processed = argumentList.map(toWireValue);
      return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];
  }
  const transferCache = new WeakMap();
  function transfer(obj, transfers) {
      transferCache.set(obj, transfers);
      return obj;
  }
  function proxy(obj) {
      return Object.assign(obj, { [proxyMarker]: true });
  }
  function toWireValue(value) {
      for (const [name, handler] of transferHandlers) {
          if (handler.canHandle(value)) {
              const [serializedValue, transferables] = handler.serialize(value);
              return [
                  {
                      type: "HANDLER" /* WireValueType.HANDLER */,
                      name,
                      value: serializedValue,
                  },
                  transferables,
              ];
          }
      }
      return [
          {
              type: "RAW" /* WireValueType.RAW */,
              value,
          },
          transferCache.get(value) || [],
      ];
  }
  function fromWireValue(value) {
      switch (value.type) {
          case "HANDLER" /* WireValueType.HANDLER */:
              return transferHandlers.get(value.name).deserialize(value.value);
          case "RAW" /* WireValueType.RAW */:
              return value.value;
      }
  }
  function requestResponseMessage(ep, msg, transfers) {
      return new Promise((resolve) => {
          const id = generateUUID();
          ep.addEventListener("message", function l(ev) {
              if (!ev.data || !ev.data.id || ev.data.id !== id) {
                  return;
              }
              ep.removeEventListener("message", l);
              resolve(ev.data);
          });
          if (ep.start) {
              ep.start();
          }
          ep.postMessage(Object.assign({ id }, msg), transfers);
      });
  }
  function generateUUID() {
      return new Array(4)
          .fill(0)
          .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
          .join("-");
  }

  var EventKinds;
  (function (EventKinds) {
      EventKinds["Loaded"] = "Loaded";
  })(EventKinds || (EventKinds = {}));
  /**
   * Default values for the handling of response bodies.
   */
  const ResponseBodyConfigMapDefaults = {
      uint8array: ['application/octet-stream'],
      json: ['application/json', 'text/json', /application\/json.*/, /text\/json\+.*/],
      text: ['text/plain', /text\/plain.*/, 'text/html', /text\/html.*/],
      formData: ['application/x-www-form-urlencoded', 'multipart/form-data'],
      blob: [/image\/.*/, /video\/.*/],
      fallback: 'blob',
  };

  const getContentType = (response) => {
      if (!response) {
          return undefined;
      }
      // this is what should be returned in the headers
      if (response.headers.has('Content-Type')) {
          return response.headers.get('Content-Type');
      }
      // handle weird servers that use lowercase headers
      if (response.headers.has('content-type')) {
          return response.headers.get('content-type');
      }
      // the Content-Type/content-type header is not part of the response
      return undefined;
  };
  const doHandleResponseMethod = (response, method) => __awaiter(void 0, void 0, void 0, function* () {
      switch (method) {
          case 'uint8array':
              return {
                  uint8array: new Uint8Array(yield response.arrayBuffer()),
              };
          case 'json':
          case 'text':
              return { text: yield response.text() };
          case 'blob': {
              const blob = yield response.blob();
              const blobUrl = URL.createObjectURL(blob);
              return { blobUrl };
          }
          case 'formData': {
              const formData = {};
              const data = yield response.formData();
              // eslint-disable-next-line no-restricted-syntax
              for (const pair of data.entries()) {
                  const [key, value] = pair;
                  formData[key] = value;
              }
              return { formData };
          }
          default:
              return {};
      }
  });
  const testIfIncluded = (value, tests) => {
      if (!tests) {
          return false;
      }
      if (!value) {
          return false;
      }
      for (let i = 0; i < tests.length; i += 1) {
          const test = tests[i];
          if (typeof test === 'string' && value === test) {
              return true;
          }
          if (test.test && test.test(value)) {
              return true;
          }
      }
      // default return is false, because nothing above matched
      return false;
  };
  const handleResponseMimeTypes = (response, config) => __awaiter(void 0, void 0, void 0, function* () {
      // combine the user supplied config with the default
      const finalConfig = Object.assign(Object.assign({}, ResponseBodyConfigMapDefaults), config);
      const contentType = getContentType(response);
      // check if the headers say what the content type are, otherwise return the bytes of the response as a blob
      if (!contentType) {
          // no content type, or body, so the response is only the status, e.g. GET
          if (!response.body) {
              return {};
          }
          // handle fallback method
          return doHandleResponseMethod(response, (config === null || config === void 0 ? void 0 : config.fallback) || 'blob');
      }
      if (testIfIncluded(contentType, finalConfig.uint8array)) {
          return doHandleResponseMethod(response, 'uint8array');
      }
      if (testIfIncluded(contentType, finalConfig.json)) {
          return doHandleResponseMethod(response, 'json');
      }
      if (testIfIncluded(contentType, finalConfig.text)) {
          return doHandleResponseMethod(response, 'text');
      }
      if (testIfIncluded(contentType, finalConfig.formData)) {
          return doHandleResponseMethod(response, 'formData');
      }
      if (testIfIncluded(contentType, finalConfig.blob)) {
          return doHandleResponseMethod(response, 'blob');
      }
      return {};
  });

  /**
   * Helper method to send typed messages.
   * @param event   The strongly typed message to send back to the calling thread.
   */
  // eslint-disable-next-line no-restricted-globals
  const postMessageWithType = (event) => self.postMessage(event);
  function run() {
      return __awaiter(this, void 0, void 0, function* () {
          const { mixFetch } = self;
          let responseBodyConfigMap = ResponseBodyConfigMapDefaults;
          const mixFetchWebWorker = {
              mixFetch: (url, args) => __awaiter(this, void 0, void 0, function* () {
                  console.log('[Worker] --- mixFetch ---', { url, args });
                  const response = yield mixFetch(url, args);
                  console.log('[Worker]', { response, json: JSON.stringify(response, null, 2) });
                  const bodyResponse = yield handleResponseMimeTypes(response, responseBodyConfigMap);
                  console.log('[Worker]', { bodyResponse });
                  const headers = {};
                  response.headers.forEach((value, key) => {
                      headers[key] = value;
                  });
                  const output = {
                      body: bodyResponse,
                      url: response.url,
                      headers,
                      status: response.status,
                      statusText: response.statusText,
                      type: response.type,
                      ok: response.ok,
                      redirected: response.redirected,
                  };
                  console.log('[Worker]', { output });
                  return output;
              }),
              setupMixFetch: (opts) => __awaiter(this, void 0, void 0, function* () {
                  console.log('[Worker] --- setupMixFetch ---', { opts });
                  if (opts === null || opts === void 0 ? void 0 : opts.responseBodyConfigMap) {
                      responseBodyConfigMap = opts.responseBodyConfigMap;
                  }
                  yield setupMixFetch(opts || {});
              }),
              disconnectMixFetch: () => __awaiter(this, void 0, void 0, function* () {
                  console.log('[Worker] --- disconnectMixFetch ---');
                  yield disconnectMixFetch();
              }),
          };
          // start comlink listening for messages and handle them above
          expose(mixFetchWebWorker);
          // notify any listeners that the web worker has loaded - HOWEVER, mixFetch hasn't been setup and the client started
          // call `setupMixFetch` from the main thread to start the Nym client
          postMessageWithType({ kind: EventKinds.Loaded, args: { loaded: true } });
      });
  }

  function main() {
      return __awaiter(this, void 0, void 0, function* () {
          yield loadWasm();
          yield run();
      });
  }
  main().catch((e) => console.error('Unhandled exception in mixFetch worker', e));

})();
//# sourceMappingURL=worker.js.map
