
new Map().set('www.facebook.com','fab fa-facebook').set();


/**
 * 
 * @param {string} type 
 * @param {object} options 
 * @param {object} options.attributes
 * @param {string[]} options.classNames
 * @param {object} options.events
 * @param {Node[]} children 
 * return {Node}
 */
 function createElement(type='div',{attributes={}, classNames=[], events={}}, ...children){
  const elem = document.createElement(type);
  for(const [attrName, attrValue] of Object.entries(attributes)){
    elem.setAttribute(attrName, attrValue);
  }
  for(const [eventType, eventHandler] of Object.entries(events)){
    elem.addEventListener(eventType, eventHandler);
  }
  elem.classList.add(...classNames);
  elem.append(...children);
  return elem;
}




