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
const selectedUsersList = document.getElementById('selected-users-list');

function createUserListItems(user, icons) {
  const listItem = [];
  for (const url of user.contacts) {
    const hostName = new URL(url).hostname;
    if (icons.has(hostName)) {
      listItem.push(createElement('li', {},
        createElement('a', {
          attributes: {
            href: url, target: '_blank'
          }
        }, createElement('i', {
          classNames: icons.get(hostName).split(' ')
        }))))
    }
  }
  return listItem;
}

function handleAddUserToList({ id }, selectedUsers, userName) {
  if (!selectedUsers.has(userName)) {
    selectedUsers.add(userName);
    const listItem = createElement('li', {},
      createElement('span', {
        classNames: ['rm-user-btn'],
        events: { click: () => handleRemoveUser(selectedUsers) }
      }, document.createTextNode('✖')),
      createElement('p', {
        attributes: { 'data-id': id }
      }, document.createTextNode(userName))
    );
    selectedUsersList.append(listItem);
  }
}

function handleImageError({ target }) {
  target.remove();
}


const removeErrorCard = ({ target: { parentElement } }) => parentElement.remove();
const appendErrorMessage = () => {
  const errorMessage = createElement('p', {
    classNames: ['err-message']
  },
    createElement('i', {
      classNames: ['fas', 'fa-dizzy'],
    }),
    document.createTextNode('we are currently working on resolving the issue')
  )
  userCardsContainer.append(errorMessage);
}
const removeSelectedUsersWrapper = () => document.getElementById('selected-users-wrapper').remove();


function handleErrorInstance() {
  removeErrorCard(event);
  appendErrorMessage();
  removeSelectedUsersWrapper();
}

function handleRemoveUser(selectedUsers, { target: { parentElement } } = event) {
  selectedUsers.delete(Array.from(parentElement.children).filter(item => item.dataset.id)[0].innerHTML);
  parentElement.remove();
}

fetch('./assets/json/data.json').then((data) => data.json()).then((userList) => {
  const selectedUsers = new Set();

  userList.filter(({ firstName, lastName }) => firstName && lastName).forEach((item) => {

    const userFullName = item.firstName + ' ' + item.lastName;
    const userInitials = item.firstName[0] + item.lastName[0];

    const userInfoContainer = createElement('div', {},
      createElement('div', {
        classNames: ['user-avatar-wrapper']
      },
        createElement('div', {
          classNames: ['initials', 'avatar-border']
        }, document.createTextNode(userInitials)),
        createElement('img', {
          attributes: { src: item.profilePicture, alt: userFullName },
          classNames: ['user-avatar', 'avatar-border'],
          events: { error: handleImageError }
        }),
      ),
      createElement('p', {
        classNames: ['user-name']
      }, document.createTextNode(userFullName))
    );

    const snLinks = createElement('ul', {
      classNames: ['sn-links']
    }, ...createUserListItems(item, snIcons))

    const userCard = createElement('article', {
      classNames: ['user-card'],
      events: { click: () => handleAddUserToList(item, selectedUsers, userFullName) }
    },
      userInfoContainer, snLinks
    );

    userCardsContainer.append(userCard);
  })
}).catch((error) => {
  console.error('Got exception: ', error);

  const errorCard = createElement('article', {
    classNames: ['error-msg-card', 'col-10', 'col-md-8', 'col-lg-4']
  },
    createElement('h2', {
      classNames: ['err-header']
    }, document.createTextNode('Error')),
    createElement('p', {
      classNames: ['err-text']
    }, document.createTextNode('Oops, something went wrong. Please try again later.')),
    createElement('button', {
      classNames: ['err-btn'],
      events: { 'click': handleErrorInstance }
    }, document.createTextNode('ok'))
  );

  userCardsContainer.append(errorCard);
});
