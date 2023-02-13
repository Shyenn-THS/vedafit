import { otherNutrients } from '@/data/otherNutrients';
import classNames from 'classnames';
import React from 'react';

type Props = {
  data: any;
};
type RowProps = {
  name: string;
  rq: number;
  iq: number;
};

const NutrientsTable = (props: Props) => {
  const { data } = props;

  const ordered = Object.keys(data)
    .sort()
    .reduce((obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {});

  const TableRow = (rowProps: RowProps) => {
    const { iq, name, rq } = rowProps;
    return (
      <tr className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
        <td className="p-3">
          <p>{name}</p>
        </td>
        <td className="p-3">
          <p>{rq} mg</p>
        </td>
        <td className="p-3">
          <p>{Math.round(iq * 0.1)} mg</p>
        </td>
        <td
          className={classNames(
            'p-3',
            iq > rq ? 'text-red-900' : 'text-green-900'
          )}
        >
          <p>{iq > rq ? 'Excessive' : 'Require More'}</p>
        </td>
      </tr>
    );
  };

  return (
    <div className="container p-2 mx-auto sm:p-4 dark:text-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead className="dark:bg-gray-700">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Required Quantity</th>
              <th className="p-3">Intake Quantity</th>
              <th className="p-3">Health</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(ordered).map(function (key, idx) {
              return (
                <TableRow
                  health="Good"
                  iq={data[key]}
                  name={key}
                  key={idx}
                  rq={otherNutrients[idx] || 0}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NutrientsTable;
