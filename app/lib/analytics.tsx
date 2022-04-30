import React from "react";

export interface AnalyticsContext {
  group(groupID: string, traits?: GroupTraits): void;
  identify(userID: string, traits?: UserTraits): void;
  screen(name: string, properties?: ScreenProperties): void;
  event(eventName: EcommerceEvent | string, properties?: TrackProperties): void;
}

export const AnalyticsContext = React.createContext<AnalyticsContext>({
  group: () => {
    return;
  },
  identify: () => {
    return;
  },
  screen: () => {
    return;
  },
  event: () => {
    return;
  },
});

export function useAnalytics(): AnalyticsContext {
  return React.useContext(AnalyticsContext);
}

export interface AnalyticsProviderProps {
  children: React.ReactNode;
  clients: AnalyticsClient[];
}

export function AnalyticsProvider(props: AnalyticsProviderProps): JSX.Element {
  const { clients, children } = props;

  return (
    <AnalyticsContext.Provider
      value={{
        group: (...params) => {
          clients.forEach((client) => client.identify(...params));
        },
        identify: (...params) => {
          clients.forEach((client) => client.identify(...params));
        },
        screen: (...params) => {
          clients.forEach((client) => client.screen(...params));
        },
        event: (...params) => {
          clients.forEach((client) => client.event(...params));
        },
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export interface AnalyticsClient {
  group(groupID: string, traits?: GroupTraits): void;
  identify(userID: string, traits?: UserTraits): void;
  screen(name: string, properties?: ScreenProperties): void;
  event(eventName: EcommerceEvent | string, properties?: TrackProperties): void;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface UserTraits {
  address?: Address;
  age?: number;
  avatar?: string;
  birthday?: Date;
  company?: {
    name: string;
    industry: string;
    id: string | number;
    plan: string;
    employeeCount: number;
  };
  createdAt?: Date;
  description?: string;
  email?: string;
  firstName?: string;
  gender?: string;
  id?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  title?: string;
  username?: string;
  website?: string;
}

export interface TrackProperties {
  /* Amount of revenue an event resulted in. This should be a decimal value, so a shirt worth $19.99 would result in a revenue of 19.99. */
  revenue?: number;
  /* Currency of the revenue an event resulted in. This should be sent in the ISO 4127 format. If this is not set, we assume the revenue to be in US dollars. */
  currency?: string;
  /* An abstract “value” to associate with an event. This is typically used in situations where the event doesn’t generate real-dollar revenue, but has an intrinsic value to a marketing team, like newsletter signups. */
  value?: number;

  /* Typically the object that was interacted with (e.g. 'Video') */
  category?: string;
  /* Useful for categorizing events (e.g. 'Fall Campaign') */
  label?: string;
}

export interface ScreenProperties {
  /* Name of the page. This is reserved for future use. */
  name?: string;
  /* Path portion of the URL of the page. Equivalent to canonical path which defaults to location.pathname from the DOM API. */
  path?: string;
  /* Full URL of the previous page. Equivalent to document.referrer from the DOM API. */
  referrer?: string;
  /* Query string portion of the URL of the page. Equivalent to location.search from the DOM API. */
  search?: string;
  /* Title of the page. Equivalent to document.title from the DOM API. */
  title?: string;
  /* Full URL of the page. First we look for the canonical url. If the canonical url is not provided, we use location.href from the DOM API. */
  url?: string;
  /* A list/array of kewords describing the content of the page. The keywords would most likely be the same as, or similar to, the keywords you would find in an html meta tag for SEO purposes. This property is mainly used by content publishers that rely heavily on pageview tracking. This is not automatically collected. */
  keywords?: string[];
}

export interface GroupTraits {
  /* Street address of a group. This should be a dictionary containing optional city, country, postalCode, state or street. */
  address?: Address;

  /* URL to an avatar image for the group */
  avatar?: string;

  /* Date the group’s account was first created. We recommend ISO-8601 date strings, but also accept Unix timestamps for convenience. */
  createdAt?: Date;

  /* Description of the group, like their personal bio */
  description?: string;

  /* Email address of group */
  email?: string;

  /* Number of employees of a group, typically used for companies */
  employees?: string;

  /* Unique ID in your database for a group */
  id?: string;

  /* Industry a user works in, or a group is part of */
  industry?: string;

  /* Name of a group */
  name?: string;

  /* Phone number of a group */
  phone?: string;

  /* Website of a group */
  website?: string;

  /* Plan that a group is in */
  plan?: string;
}

export type EcommerceEvent =
  /* Browsing Overview */
  | "Products Searched" // User searched for products
  | "Product List Viewed" // User viewed a product list or category
  | "Product List Filtered" // User filtered a product list or category

  /* Promotions Overview */
  | "Promotion Viewed" // User viewed promotion
  | "Promotion Clicked" // User clicked on promotion

  /* Core Ordering Overview */
  | "Product Clicked" // User clicked on a product
  | "Product Viewed" // User viewed a product details
  | "Product Added" // User added a product to their shopping cart
  | "Product Removed" // User removed a product from their shopping cart
  | "Cart Viewed" // User viewed their shopping cart
  | "Checkout Started" // User initiated the order process (a transaction is created)
  | "Checkout Step Viewed" // User viewed a checkout step
  | "Checkout Step Completed" // User completed a checkout step
  | "Payment Info Entered" // User added payment information
  | "Order Completed" // User completed the order
  | "Order Updated" // User updated the order
  | "Order Refunded" // User refunded the order
  | "Order Cancelled" // User cancelled the order

  /* Coupons Overview */
  | "Coupon Entered" // User entered a coupon on a shopping cart or order
  | "Coupon Applied" // Coupon was applied on a user’s shopping cart or order
  | "Coupon Denied" // Coupon was denied from a user’s shopping cart or order
  | "Coupon Removed" // User removed a coupon from a cart or order

  /* Wishlisting Overview */
  | "Product Added to Wishlist" // User added a product to the wish list
  | "Product Removed from Wishlist" // User removed a product from the wish list
  | "Wishlist Product Added to Cart" // User added a wishlist product to the cart

  /* Sharing Overview */
  | "Product Shared" // Shared a product with one or more friends
  | "Cart Shared" // Shared the cart with one or more friends

  /* Reviewing Overview */
  | "Product Reviewed"; // User reviewed a product

export interface Context {
  /* Whether a user is active. This is usually used to flag an .identify() call to just update the traits but not “last seen.”*/
  active?: boolean;
  /* dictionary of information about the current application, containing name, version and build. This is collected automatically from our mobile libraries when possible.*/
  app?: {
    name?: string;
    version?: string;
    build?: string;
  };
  /* Dictionary of information about the campaign that resulted in the API call, containing name, source, medium, term and content. This maps directly to the common UTM campaign parameters.*/
  campaign?: {
    name?: string;
    source?: string;
    medium?: string;
    term?: string;
    content?: string;
  };
  /* Dictionary of information about the device, containing id, manufacturer, model, name, type and version*/
  device?: {
    type?: string;
    id?: string;
    advertisingID?: string;
    adTrackingEnabled?: boolean;
    manufacturer?: string;
    model?: string;
    name?: string;
  };
  /* Current user’s IP address*/
  ip?: string;
  /* Dictionary of information about the library making the requests to the API, containing name and version*/
  library?: {
    name?: string;
    version?: string;
  };
  /* Locale string for the current user, for example en-US*/
  locale?: string;
  /* Dictionary of information about the user’s current location, containing city, country, latitude, longitude, region and speed*/
  location?: {
    latitude?: number;
    longitude?: number;
  };
  /* Dictionary of information about the current network connection, containing bluetooth, carrier, cellular and wifi*/
  network?: {
    bluetooth?: boolean;
    carrier?: string;
    cellular?: boolean;
    wifi?: boolean;
  };
  /* Dictionary of information about the operating system, containing name and version*/
  os?: {
    name?: string;
    version?: string;
  };
  /* Dictionary of information about the current page in the browser, containing hash, path, referrer, search, title and url. Automatically collected by Analytics.js.*/
  page?: ScreenProperties;
  /* Dictionary of information about the way the user was referred to the website or app, containing type, name, url and link*/
  referrer?: {
    type?: string;
    name?: string;
    url?: string;
    link?: string;
  };
  /* Dictionary of information about the device’s screen, containing density, height and width*/
  screen?: {
    density?: number;
    height?: number;
    width?: number;
  };
  /* Timezones are sent as tzdata strings to add user timezone information which might be stripped from the timestamp. Ex?: America/New_York*/
  timezone?: string;
  /* Group / Account ID. This is useful in B2B use cases where you need to attribute your non-group calls to a company or account. It is relied on by several Customer Success and CRM tools.*/
  groupID?: string;
  /* Dictionary of traits of the current user. This is useful in cases where you need to track an event, but also associate information from a previous identify call. You should fill this object the same way you would fill traits in an identify call.*/
  traits?: UserTraits;
  /* User agent of the device making the request*/
  userAgent?: string;
}
