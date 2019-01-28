import React from 'react';
import Event from '../src/components/Event';
import renderer from 'react-test-renderer';

test('Event renders correctly', () => {
    const tree = renderer.create(<Event/>).toJSON();
    expect(tree).toMatchSnapshot();
  });