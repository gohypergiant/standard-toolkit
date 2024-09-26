export type City = 'New York' | 'San Diego' | 'Austin';

export type Address = {
  city: City;
  street: string;
};

export type Person = {
  name: string;
  address?: Address;
};

export type Profile = {
  info: Person;
};

export type User = {
  username: string;
  password: string;
  profile: Profile[];
};

export const personStore: Person = {
  name: 'Alice',
  address: {
    city: 'New York',
    street: '123 Main St',
  },
};

export const userStore: User = {
  username: 'foobar',
  password: 'cleverPassword',
  profile: [
    {
      info: {
        name: 'Frank',
        address: {
          city: 'Austin',
          street: '123 Main St',
        },
      },
    },
  ],
};
