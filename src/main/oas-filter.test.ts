import {oasToDescriptions} from './oas-filter';
import spec from '../../oas/spotify-oas.json';
import {OpenApiSpec} from '../models/open-api-spec';

test('oasToDescriptions', () => {
  const actual = oasToDescriptions(spec as OpenApiSpec);
  expect(actual).toMatchSnapshot();
});