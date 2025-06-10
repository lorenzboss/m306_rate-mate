export type Review = {
  ReviewID: string;
  FKReceiverId: string;
  FKOwnerId: string;
  owner: {
    EMail: string;
  };
  ratings: {
    RatingID: string;
    Rating: number;
    FKReviewId: string;
    FKAspectId: string;
    aspect: {
      AspectID: string;
      Name: string;
      Description: string;
    };
  }[];
};
