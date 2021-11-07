
const snIcons = new Map().set('www.facebook.com', 'fab fa-facebook-square')
  .set('twitter.com', 'fab fa-twitter-square')
  .set('www.instagram.com', 'fab fa-instagram-square');


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
function createElement(type = 'div', { attributes, classNames, events }, ...children) {
  const elem = document.createElement(type);
  if (attributes) {
    for (const [attrName, attrValue] of Object.entries(attributes)) {
      elem.setAttribute(attrName, attrValue);
    }
  }
  if (events) {
    for (const [eventType, eventHandler] of Object.entries(events)) {
      elem.addEventListener(eventType, eventHandler);
    }
  }
  if (classNames) {
    elem.classList.add(...classNames);
  }
  elem.append(...children);
  return elem;
}


const userCardsContainer = document.getElementById('user-cards-container');

function handleAddUserToList() { console.log('article'); }

function createUserListItems(user, icons) {
  const listItem = [];
  for (const url of user.contacts) {
    const hostName = new URL(url).hostname;
    if (icons.has(hostName)) {
      listItem.push(createElement('li', {},
        createElement('a', { attributes: { href: url, target: '_blank' } },
          createElement('i', {
            classNames: icons.get(hostName).split(' ')
          }))))
    }
  }
  return listItem;
}

fetch('./assets/json/data.json').then((data) => data.json()).then((userList) => {
  userList.filter(({ firstName, lastName }) => firstName && lastName).forEach((item) => {

    const userFullName = item.firstName + ' ' + item.lastName;
    const userInitials = item.firstName[0] + item.lastName[0];

    const userInfoContainer = createElement('div', {},
      createElement('img', {
        attributes: { src: item.profilePicture, alt: userFullName },
        classNames: ['user-avatar']
      }),
      createElement('p', {
        classNames: ['user-name']
      }, document.createTextNode(userFullName))
    );

    const snLinks = createElement('ul', {
      classNames: ['sn-links']
    }, ...createUserListItems(item, snIcons))

    const userCard = createElement('article', {
      attributes: {},
      classNames: ['user-card'],
      events: { click: handleAddUserToList }
    },
      userInfoContainer, snLinks
    );

    userCardsContainer.append(userCard);
  })
})



