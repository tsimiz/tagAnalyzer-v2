export interface TagInfo {
  key: string;
  value: string;
  resourceType: string;
  resourceName: string;
  resourceGroupName: string;
  subscriptionId: string;
  subscriptionName: string;
}

export interface TagSearchRequest {
  tagKey?: string;
  tagValue?: string;
}

export interface SubscriptionInfo {
  subscriptionId: string;
  subscriptionName: string;
}
