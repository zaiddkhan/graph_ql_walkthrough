import { gql } from '@apollo/client';

export const GET_AUTHENTICATED_USERS = gql`
  query GetAuthenticatedUser {
    authUser {
      _id
      username 
      profilePicture
    }
  }
`;