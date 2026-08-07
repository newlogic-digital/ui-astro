import attributesObserver from '@webreflection/custom-elements-attributes';
import {expando} from '@webreflection/custom-elements-upgrade';
import qsaObserver from 'qsa-observer';

const {customElements, document, Element, MutationObserver, Object, Promise, Map, Set, WeakMap, Reflect} = self;
const {createElement} = document;
const {define, get, upgrade} = customElements;
const {construct} = Reflect || {
  construct(HTMLElement) {
    return HTMLElement.call(this);
  }
};
const {defineProperty, getOwnPropertyNames, setPrototypeOf} = Object;
const shadowRoots = new WeakMap();
const shadows = new Set();
const classes = new Map();
const defined = new Map();
const prototypes = new Map();
const registry = new Map();
const shadowed = [];
const query = [];
const getCE = (is) => registry.get(is) || get.call(customElements, is);
const handle = (element, connected, selector) => {
  const proto = prototypes.get(selector);
  if (connected && !proto.isPrototypeOf(element)) {
    const redefine = expando(element);
    override = setPrototypeOf(element, proto);
    try {
      new proto.constructor();
    } finally {
      override = null;
      redefine();
    }
  }
  const method = `${connected ? "" : "dis"}connectedCallback`;
  if (method in proto)
    element[method]();
};
const {parse} = qsaObserver({
  query,
  handle
});
const {parse: parseShadowed} = qsaObserver({
  query: shadowed,
  handle(element, connected) {
    if (shadowRoots.has(element)) {
      if (connected)
        shadows.add(element);
      else
        shadows.delete(element);
      if (query.length)
        parseShadow.call(query, element);
    }
  }
});
// qsaObserver also patches attachShadow
// be sure this runs *after* that
const {attachShadow} = Element.prototype;
if (attachShadow)
  Element.prototype.attachShadow = function(init) {
    const root = attachShadow.call(this, init);
    shadowRoots.set(this, root);
    return root;
  };
const whenDefined = (name) => {
  if (!defined.has(name)) {
    let _,
      $ = new Promise(($) => {
        _ = $;
      });
    defined.set(name, {
      $,
      _
    });
  }
  return defined.get(name).$;
};
const augment = attributesObserver(whenDefined, MutationObserver);
let override = null;
getOwnPropertyNames(self).filter((k) => /^HTML.*Element$/.test(k)).forEach((k) => {
  const HTMLElement = self[k];
  function HTMLBuiltIn() {
    const {constructor} = this;
    if (!classes.has(constructor))
      throw new TypeError("Illegal constructor");
    const {is, tag} = classes.get(constructor);
    if (is) {
      if (override)
        return augment(override, is);
      const element = createElement.call(document, tag);
      element.setAttribute("is", is);
      return augment(setPrototypeOf(element, constructor.prototype), is);
    } else
      return construct.call(this, HTMLElement, [], constructor);
  }
  setPrototypeOf(HTMLBuiltIn, HTMLElement);
  defineProperty(HTMLBuiltIn.prototype = HTMLElement.prototype, "constructor", {
    value: HTMLBuiltIn
  });
  defineProperty(self, k, {
    value: HTMLBuiltIn
  });
});
document.createElement = function(name, options) {
  const is = options && options.is;
  console.log(is);
  if (is) {
    const Class = registry.get(is);
    if (Class && classes.get(Class).tag === name)
      return new Class();
  }
  const element = createElement.call(document, name);
  if (is)
    element.setAttribute("is", is);
  return element;
};
customElements.get = getCE;
customElements.whenDefined = whenDefined;
customElements.upgrade = function(element) {
  const is = element.getAttribute("is");
  if (is) {
    const constructor = registry.get(is);
    if (constructor) {
      augment(setPrototypeOf(element, constructor.prototype), is);
      // apparently unnecessary because this is handled by qsa observer
      // if (element.isConnected && element.connectedCallback)
      //   element.connectedCallback();
      return;
    }
  }
  upgrade.call(customElements, element);
};
customElements.define = function(is, Class, options) {
  if (getCE(is))
    throw new Error(`'${is}' has already been defined as a custom element`);
  let selector;
  const tag = options && options.extends;
  classes.set(Class, tag ? {
    is,
    tag
  } : {
    is: "",
    tag: is
  });
  if (tag) {
    selector = `${tag}[is="${is}"]`;
    prototypes.set(selector, Class.prototype);
    registry.set(is, Class);
    query.push(selector);
  } else {
    define.apply(customElements, arguments);
    shadowed.push(selector = is);
  }
  whenDefined(is).then(() => {
    if (tag) {
      parse(document.querySelectorAll(selector));
      shadows.forEach(parseShadow, [selector]);
    } else
      parseShadowed(document.querySelectorAll(selector));
  });
  defined.get(is)._(Class);
};
function parseShadow(element) {
  const root = shadowRoots.get(element);
  parse(root.querySelectorAll(this), element.isConnected);
}

//# sourceMappingURL=data:application/json;base64,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TSxJQUFJLEdBQUcsK0NBQStDO0NBQ3JGLElBQUk7Q0FDSixNQUFNLE1BQU0sV0FBVyxRQUFRO0NBQy9CLFFBQVEsSUFBSSxPQUFPLE1BQU07RUFDeEI7RUFDQTtDQUNELElBQUk7RUFDSCxJQUFJO0VBQ0osS0FBSztDQUNOLENBQUM7Q0FDRCxJQUFJLEtBQUs7RUFDUixXQUFXLEdBQUcsSUFBSSxPQUFPLEdBQUc7RUFDNUIsV0FBVyxJQUFJLFVBQVUsTUFBTSxTQUFTO0VBQ3hDLFNBQVMsSUFBSSxJQUFJLEtBQUs7RUFDdEIsTUFBTSxLQUFLLFFBQVE7Q0FDcEIsT0FBTztFQUNOLE9BQU8sTUFBTSxnQkFBZ0IsU0FBUztFQUN0QyxTQUFTLEtBQUssV0FBVyxFQUFFO0NBQzVCO0NBQ0EsWUFBWSxFQUFFLENBQUMsQ0FBQyxXQUFXO0VBQzFCLElBQUksS0FBSztHQUNSLE1BQU0sU0FBUyxpQkFBaUIsUUFBUSxDQUFDO0dBQ3pDLFFBQVEsUUFBUSxhQUFhLENBQUMsUUFBUSxDQUFDO0VBQ3hDLE9BQU8sY0FBYyxTQUFTLGlCQUFpQixRQUFRLENBQUM7Q0FDekQsQ0FBQztDQUNELFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUs7QUFDeEI7QUFDQSxTQUFTLFlBQVksU0FBUztDQUM3QixNQUFNLE9BQU8sWUFBWSxJQUFJLE9BQU87Q0FDcEMsTUFBTSxLQUFLLGlCQUFpQixJQUFJLEdBQUcsUUFBUSxXQUFXO0FBQ3ZEIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkxheW91dC5hc3Rybz9hc3RybyZ0eXBlPXNjcmlwdCZpbmRleD0wJmxhbmcudHMiXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF0dHJpYnV0ZXNPYnNlcnZlciBmcm9tIFwiQHdlYnJlZmxlY3Rpb24vY3VzdG9tLWVsZW1lbnRzLWF0dHJpYnV0ZXNcIjtcbmltcG9ydCB7IGV4cGFuZG8gfSBmcm9tIFwiQHdlYnJlZmxlY3Rpb24vY3VzdG9tLWVsZW1lbnRzLXVwZ3JhZGVcIjtcbmltcG9ydCBxc2FPYnNlcnZlciBmcm9tIFwicXNhLW9ic2VydmVyXCI7XG5jb25zdCB7IGN1c3RvbUVsZW1lbnRzLCBkb2N1bWVudCwgRWxlbWVudCwgTXV0YXRpb25PYnNlcnZlciwgT2JqZWN0LCBQcm9taXNlLCBNYXAsIFNldCwgV2Vha01hcCwgUmVmbGVjdCB9ID0gc2VsZjtcbmNvbnN0IHsgY3JlYXRlRWxlbWVudCB9ID0gZG9jdW1lbnQ7XG5jb25zdCB7IGRlZmluZSwgZ2V0LCB1cGdyYWRlIH0gPSBjdXN0b21FbGVtZW50cztcbmNvbnN0IHsgY29uc3RydWN0IH0gPSBSZWZsZWN0IHx8IHsgY29uc3RydWN0KEhUTUxFbGVtZW50KSB7XG5cdHJldHVybiBIVE1MRWxlbWVudC5jYWxsKHRoaXMpO1xufSB9O1xuY29uc3QgeyBkZWZpbmVQcm9wZXJ0eSwgZ2V0T3duUHJvcGVydHlOYW1lcywgc2V0UHJvdG90eXBlT2YgfSA9IE9iamVjdDtcbmNvbnN0IHNoYWRvd1Jvb3RzID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHNoYWRvd3MgPSBuZXcgU2V0KCk7XG5jb25zdCBjbGFzc2VzID0gbmV3IE1hcCgpO1xuY29uc3QgZGVmaW5lZCA9IG5ldyBNYXAoKTtcbmNvbnN0IHByb3RvdHlwZXMgPSBuZXcgTWFwKCk7XG5jb25zdCByZWdpc3RyeSA9IG5ldyBNYXAoKTtcbmNvbnN0IHNoYWRvd2VkID0gW107XG5jb25zdCBxdWVyeSA9IFtdO1xuY29uc3QgZ2V0Q0UgPSAoaXMpID0+IHJlZ2lzdHJ5LmdldChpcykgfHwgZ2V0LmNhbGwoY3VzdG9tRWxlbWVudHMsIGlzKTtcbmNvbnN0IGhhbmRsZSA9IChlbGVtZW50LCBjb25uZWN0ZWQsIHNlbGVjdG9yKSA9PiB7XG5cdGNvbnN0IHByb3RvID0gcHJvdG90eXBlcy5nZXQoc2VsZWN0b3IpO1xuXHRpZiAoY29ubmVjdGVkICYmICFwcm90by5pc1Byb3RvdHlwZU9mKGVsZW1lbnQpKSB7XG5cdFx0Y29uc3QgcmVkZWZpbmUgPSBleHBhbmRvKGVsZW1lbnQpO1xuXHRcdG92ZXJyaWRlID0gc2V0UHJvdG90eXBlT2YoZWxlbWVudCwgcHJvdG8pO1xuXHRcdHRyeSB7XG5cdFx0XHRuZXcgcHJvdG8uY29uc3RydWN0b3IoKTtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0b3ZlcnJpZGUgPSBudWxsO1xuXHRcdFx0cmVkZWZpbmUoKTtcblx0XHR9XG5cdH1cblx0Y29uc3QgbWV0aG9kID0gYCR7Y29ubmVjdGVkID8gXCJcIiA6IFwiZGlzXCJ9Y29ubmVjdGVkQ2FsbGJhY2tgO1xuXHRpZiAobWV0aG9kIGluIHByb3RvKSBlbGVtZW50W21ldGhvZF0oKTtcbn07XG5jb25zdCB7IHBhcnNlIH0gPSBxc2FPYnNlcnZlcih7XG5cdHF1ZXJ5LFxuXHRoYW5kbGVcbn0pO1xuY29uc3QgeyBwYXJzZTogcGFyc2VTaGFkb3dlZCB9ID0gcXNhT2JzZXJ2ZXIoe1xuXHRxdWVyeTogc2hhZG93ZWQsXG5cdGhhbmRsZShlbGVtZW50LCBjb25uZWN0ZWQpIHtcblx0XHRpZiAoc2hhZG93Um9vdHMuaGFzKGVsZW1lbnQpKSB7XG5cdFx0XHRpZiAoY29ubmVjdGVkKSBzaGFkb3dzLmFkZChlbGVtZW50KTtcblx0XHRcdGVsc2Ugc2hhZG93cy5kZWxldGUoZWxlbWVudCk7XG5cdFx0XHRpZiAocXVlcnkubGVuZ3RoKSBwYXJzZVNoYWRvdy5jYWxsKHF1ZXJ5LCBlbGVtZW50KTtcblx0XHR9XG5cdH1cbn0pO1xuLy8gcXNhT2JzZXJ2ZXIgYWxzbyBwYXRjaGVzIGF0dGFjaFNoYWRvd1xuLy8gYmUgc3VyZSB0aGlzIHJ1bnMgKmFmdGVyKiB0aGF0XG5jb25zdCB7IGF0dGFjaFNoYWRvdyB9ID0gRWxlbWVudC5wcm90b3R5cGU7XG5pZiAoYXR0YWNoU2hhZG93KSBFbGVtZW50LnByb3RvdHlwZS5hdHRhY2hTaGFkb3cgPSBmdW5jdGlvbihpbml0KSB7XG5cdGNvbnN0IHJvb3QgPSBhdHRhY2hTaGFkb3cuY2FsbCh0aGlzLCBpbml0KTtcblx0c2hhZG93Um9vdHMuc2V0KHRoaXMsIHJvb3QpO1xuXHRyZXR1cm4gcm9vdDtcbn07XG5jb25zdCB3aGVuRGVmaW5lZCA9IChuYW1lKSA9PiB7XG5cdGlmICghZGVmaW5lZC5oYXMobmFtZSkpIHtcblx0XHRsZXQgXywgJCA9IG5ldyBQcm9taXNlKCgkKSA9PiB7XG5cdFx0XHRfID0gJDtcblx0XHR9KTtcblx0XHRkZWZpbmVkLnNldChuYW1lLCB7XG5cdFx0XHQkLFxuXHRcdFx0X1xuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBkZWZpbmVkLmdldChuYW1lKS4kO1xufTtcbmNvbnN0IGF1Z21lbnQgPSBhdHRyaWJ1dGVzT2JzZXJ2ZXIod2hlbkRlZmluZWQsIE11dGF0aW9uT2JzZXJ2ZXIpO1xubGV0IG92ZXJyaWRlID0gbnVsbDtcbmdldE93blByb3BlcnR5TmFtZXMoc2VsZikuZmlsdGVyKChrKSA9PiAvXkhUTUwuKkVsZW1lbnQkLy50ZXN0KGspKS5mb3JFYWNoKChrKSA9PiB7XG5cdGNvbnN0IEhUTUxFbGVtZW50ID0gc2VsZltrXTtcblx0ZnVuY3Rpb24gSFRNTEJ1aWx0SW4oKSB7XG5cdFx0Y29uc3QgeyBjb25zdHJ1Y3RvciB9ID0gdGhpcztcblx0XHRpZiAoIWNsYXNzZXMuaGFzKGNvbnN0cnVjdG9yKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIklsbGVnYWwgY29uc3RydWN0b3JcIik7XG5cdFx0Y29uc3QgeyBpcywgdGFnIH0gPSBjbGFzc2VzLmdldChjb25zdHJ1Y3Rvcik7XG5cdFx0aWYgKGlzKSB7XG5cdFx0XHRpZiAob3ZlcnJpZGUpIHJldHVybiBhdWdtZW50KG92ZXJyaWRlLCBpcyk7XG5cdFx0XHRjb25zdCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudC5jYWxsKGRvY3VtZW50LCB0YWcpO1xuXHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJpc1wiLCBpcyk7XG5cdFx0XHRyZXR1cm4gYXVnbWVudChzZXRQcm90b3R5cGVPZihlbGVtZW50LCBjb25zdHJ1Y3Rvci5wcm90b3R5cGUpLCBpcyk7XG5cdFx0fSBlbHNlIHJldHVybiBjb25zdHJ1Y3QuY2FsbCh0aGlzLCBIVE1MRWxlbWVudCwgW10sIGNvbnN0cnVjdG9yKTtcblx0fVxuXHRzZXRQcm90b3R5cGVPZihIVE1MQnVpbHRJbiwgSFRNTEVsZW1lbnQpO1xuXHRkZWZpbmVQcm9wZXJ0eShIVE1MQnVpbHRJbi5wcm90b3R5cGUgPSBIVE1MRWxlbWVudC5wcm90b3R5cGUsIFwiY29uc3RydWN0b3JcIiwgeyB2YWx1ZTogSFRNTEJ1aWx0SW4gfSk7XG5cdGRlZmluZVByb3BlcnR5KHNlbGYsIGssIHsgdmFsdWU6IEhUTUxCdWlsdEluIH0pO1xufSk7XG5kb2N1bWVudC5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24obmFtZSwgb3B0aW9ucykge1xuXHRjb25zdCBpcyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5pcztcblx0Y29uc29sZS5sb2coaXMpO1xuXHRpZiAoaXMpIHtcblx0XHRjb25zdCBDbGFzcyA9IHJlZ2lzdHJ5LmdldChpcyk7XG5cdFx0aWYgKENsYXNzICYmIGNsYXNzZXMuZ2V0KENsYXNzKS50YWcgPT09IG5hbWUpIHJldHVybiBuZXcgQ2xhc3MoKTtcblx0fVxuXHRjb25zdCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudC5jYWxsKGRvY3VtZW50LCBuYW1lKTtcblx0aWYgKGlzKSBlbGVtZW50LnNldEF0dHJpYnV0ZShcImlzXCIsIGlzKTtcblx0cmV0dXJuIGVsZW1lbnQ7XG59O1xuY3VzdG9tRWxlbWVudHMuZ2V0ID0gZ2V0Q0U7XG5jdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCA9IHdoZW5EZWZpbmVkO1xuY3VzdG9tRWxlbWVudHMudXBncmFkZSA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0Y29uc3QgaXMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImlzXCIpO1xuXHRpZiAoaXMpIHtcblx0XHRjb25zdCBjb25zdHJ1Y3RvciA9IHJlZ2lzdHJ5LmdldChpcyk7XG5cdFx0aWYgKGNvbnN0cnVjdG9yKSB7XG5cdFx0XHRhdWdtZW50KHNldFByb3RvdHlwZU9mKGVsZW1lbnQsIGNvbnN0cnVjdG9yLnByb3RvdHlwZSksIGlzKTtcblx0XHRcdC8vIGFwcGFyZW50bHkgdW5uZWNlc3NhcnkgYmVjYXVzZSB0aGlzIGlzIGhhbmRsZWQgYnkgcXNhIG9ic2VydmVyXG5cdFx0XHQvLyBpZiAoZWxlbWVudC5pc0Nvbm5lY3RlZCAmJiBlbGVtZW50LmNvbm5lY3RlZENhbGxiYWNrKVxuXHRcdFx0Ly8gICBlbGVtZW50LmNvbm5lY3RlZENhbGxiYWNrKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cdHVwZ3JhZGUuY2FsbChjdXN0b21FbGVtZW50cywgZWxlbWVudCk7XG59O1xuY3VzdG9tRWxlbWVudHMuZGVmaW5lID0gZnVuY3Rpb24oaXMsIENsYXNzLCBvcHRpb25zKSB7XG5cdGlmIChnZXRDRShpcykpIHRocm93IG5ldyBFcnJvcihgJyR7aXN9JyBoYXMgYWxyZWFkeSBiZWVuIGRlZmluZWQgYXMgYSBjdXN0b20gZWxlbWVudGApO1xuXHRsZXQgc2VsZWN0b3I7XG5cdGNvbnN0IHRhZyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5leHRlbmRzO1xuXHRjbGFzc2VzLnNldChDbGFzcywgdGFnID8ge1xuXHRcdGlzLFxuXHRcdHRhZ1xuXHR9IDoge1xuXHRcdGlzOiBcIlwiLFxuXHRcdHRhZzogaXNcblx0fSk7XG5cdGlmICh0YWcpIHtcblx0XHRzZWxlY3RvciA9IGAke3RhZ31baXM9XCIke2lzfVwiXWA7XG5cdFx0cHJvdG90eXBlcy5zZXQoc2VsZWN0b3IsIENsYXNzLnByb3RvdHlwZSk7XG5cdFx0cmVnaXN0cnkuc2V0KGlzLCBDbGFzcyk7XG5cdFx0cXVlcnkucHVzaChzZWxlY3Rvcik7XG5cdH0gZWxzZSB7XG5cdFx0ZGVmaW5lLmFwcGx5KGN1c3RvbUVsZW1lbnRzLCBhcmd1bWVudHMpO1xuXHRcdHNoYWRvd2VkLnB1c2goc2VsZWN0b3IgPSBpcyk7XG5cdH1cblx0d2hlbkRlZmluZWQoaXMpLnRoZW4oKCkgPT4ge1xuXHRcdGlmICh0YWcpIHtcblx0XHRcdHBhcnNlKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcblx0XHRcdHNoYWRvd3MuZm9yRWFjaChwYXJzZVNoYWRvdywgW3NlbGVjdG9yXSk7XG5cdFx0fSBlbHNlIHBhcnNlU2hhZG93ZWQoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuXHR9KTtcblx0ZGVmaW5lZC5nZXQoaXMpLl8oQ2xhc3MpO1xufTtcbmZ1bmN0aW9uIHBhcnNlU2hhZG93KGVsZW1lbnQpIHtcblx0Y29uc3Qgcm9vdCA9IHNoYWRvd1Jvb3RzLmdldChlbGVtZW50KTtcblx0cGFyc2Uocm9vdC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMpLCBlbGVtZW50LmlzQ29ubmVjdGVkKTtcbn0iXX0=
