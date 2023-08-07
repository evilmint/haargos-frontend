import * as R from 'ramda';

const fullNameInitials = R.pipe(
  R.pathOr('John Doe', ['given_name', 'family_name']),
  R.split(' '),
  R.map(R.head),
  R.take(2),
  R.join(''),
);

export { fullNameInitials };
