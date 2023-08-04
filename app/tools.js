import * as R from 'ramda';

const fullNameInitials = R.pipe(
  R.pathOr('John Doe', ['full_name']),
  R.split(' '),
  R.map(R.head),
  R.take(2),
  R.join(''),
);

export { fullNameInitials };
