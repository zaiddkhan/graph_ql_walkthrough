import { gql } from '@apollo/client';

export const GET_AUTHENTICATED_USERS = gql`
  query GetDogs {
    authUser {
      _id
      username
      name 
      profilePicture
    }
  }
`;