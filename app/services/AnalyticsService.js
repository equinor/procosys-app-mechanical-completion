import Analytics from 'appcenter-analytics';

/**
 * Analytics.js
 * 
 * The service is ment as an abstraction where the implementation can later be
 * switched out with other frameworks. 
 * Avoiding adding framework specific logic within each component. 
 */

 let PLANT = '';

 const setPlant = (pPlant = '') => {
   PLANT = pPlant;
 }

 /**
  * Generic event tracker
  * 
  * @param {String} eventName Name of the event
  * @param {Object} data Properties to be sent with the event
  */
 const trackEvent = (eventName, data = {}) => {
    data.plant = PLANT;
    Analytics.trackEvent(eventName, data);
 }

 /**
  * Tracks search component initialization that doesnt use views
  * 
  * @param {String} search Name of searchview loaded
  */
 const SEARCH_LOAD = (search) => {
   trackEvent('SEARCH_LOAD_VIEW', {name: search})
 }

 /**
  * Track usage of specific buttons / features. 
  * 
  * @param {String} buttonName Name of button that was clicked
  */
 const BUTTON_CLICKED = (buttonName) => {
   trackEvent('BUTTON_CLICKED', {name: buttonName});
 }

  /**
  * Track usage of specific buttons / features. 
  * 
  * @param {String} buttonName Name of button that was clicked
  */
 const LINK_CLICKED = (link) => {
  trackEvent('LINK_CLICKED', {url: link});
}

 /**
  * Track search usage
  * 
  * @param {String} name Name of the search that was triggered
  * @param {Number} numberOfCharactersThatTriggeredTheSearch Number of characters that the used stop typing at. 
  */
 const SEARCH_TRIGGERED = (name, numberOfCharactersThatTriggeredTheSearch) => {
   trackEvent('SEARCH_TRIGGERED', {name, numberOfCharactersThatTriggeredTheSearch});
 }

 /**
  * Helps track which filters are commonly used. 
  * 
  * @param {String} filterName Name of filter activated
  */
 const FILTER_ACTIVATED = (filterName) => {
   trackEvent('FILTER_ACTIVATED', {name: filterName});
 }

export default {
  setPlant: setPlant,
  trackEvent: trackEvent,
  SEARCH_LOAD: SEARCH_LOAD,
  BUTTON_CLICKED: BUTTON_CLICKED,
  SEARCH_TRIGGERED: SEARCH_TRIGGERED,
  FILTER_ACTIVATED: FILTER_ACTIVATED,
  LINK_CLICKED: LINK_CLICKED
}
