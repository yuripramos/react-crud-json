import React from 'react';
import * as search from 'searchtabular';
import PerPage from './PerPage';

const PrimaryControls = ({
  perPage, columns, rows, column, query,
  onPerPage, onSearch, onColumnChange,
  ...props
}) => (
  <div {...props}>

    <div className="search-container">
      <search.Field
        column={column}
        query={query}
        columns={columns}
        rows={rows}
        onChange={onSearch}
        onColumnChange={onColumnChange}
      />
    </div>
  </div>
);
PrimaryControls.propTypes = {
  perPage: React.PropTypes.number,
  columns: React.PropTypes.array,
  rows: React.PropTypes.array,
  column: React.PropTypes.string,
  query: React.PropTypes.object,
  onPerPage: React.PropTypes.func,
  onSearch: React.PropTypes.func,
  onColumnChange: React.PropTypes.func
};

export default PrimaryControls;