import React from 'react';

import { WheelPicker, Row } from '../app/components';

export default {
  title: 'WheelPicker',
  component: WheelPicker,
};

function StatefulCheckbox() {
  const [day, setDay] = React.useState('15');
  const [month, setMonth] = React.useState('March');
  const [year, setYear] = React.useState('2019');

  return (
    <Row>
      <WheelPicker
        value={month}
        options={[
          { label: 'January', value: 'January' },
          { label: 'February', value: 'February' },
          { label: 'March', value: 'March' },
          { label: 'April', value: 'April' },
          { label: 'May', value: 'May' },
          { label: 'June', value: 'June' },
          { label: 'July', value: 'July' },
          { label: 'August', value: 'August' },
          { label: 'September', value: 'September' },
          { label: 'October', value: 'October' },
          { label: 'November', value: 'November' },
          { label: 'December', value: 'December' },
        ]}
        onChange={(value) => {
          setMonth(value);
        }}
      />
      <WheelPicker
        value={day}
        options={new Array(31)
          .fill(0)
          .map((v, i) => ({ label: `${i + 1}`, value: `${i + 1}` }))}
        onChange={(value) => {
          setDay(value);
        }}
      />
      <WheelPicker
        value={year}
        options={new Array(50)
          .fill(0)
          .map((v, i) => ({ label: `${2000 + i}`, value: `${2000 + i}` }))}
        onChange={(value) => {
          setYear(value);
        }}
      />
    </Row>
  );
}

export const Default = () => <StatefulCheckbox />;
