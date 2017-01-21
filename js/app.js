import React from 'react';
import ReactDOM from 'react-dom';
import { compose } from 'redux';
import {
  cloneDeep, findIndex, orderBy, keys, values, transforms
} from 'lodash';
import * as Table from 'reactabular-table';
import * as search from 'searchtabular';
import * as sort from 'sortabular';
import * as resizable from 'reactabular-resizable';
import * as resolve from 'table-resolver';
import * as edit from 'react-edit';
import uuid from 'uuid';

import {
  Paginator, PrimaryControls, paginate
} from '../helpers';

const app = document.getElementById('app')

const rows = [
   { "combustivel" : "Flex",
  "imagem" : null,
  "marca" : "Volkswagem",
  "modelo" : "Gol",
  "placa" : "FFF-5498",
  "valor" : 20000
  },
  { "combustivel" : "Gasolina",
  "imagem" : null,
  "marca" : "Volkswagem",
  "modelo" : "Fox",
  "placa" : "FOX-4125",
  "valor" : "20000"
  },
  { "combustivel" : "Alcool",
  "imagem" : "http://carros.ig.com.br/fotos/2010/290_193/Fusca2_290_193.jpg",
  "marca" : "Volkswagen",
  "modelo" : "Fusca",
  "placa" : "PAI-4121",
  "valor" : "20000"
  }
  
];

const schema = {
  type: 'object',
  properties: {
    combustivel: {
      type: 'string'
    },
    imagem: {
      type: 'string'
    },
    marca: {
      type: 'string'
    },
    modelo: {
      type: 'string'
    },
    placa: {
      type: 'string'
    },
    valor: {
      type: 'integer'
    }
  },
  required: ['combustivel', 'imagem', 'marca', 'modelo', 'placa']
};


class AllFeaturesTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: rows, 
      searchColumn: 'all',
      query: {}, // search query
      sortingColumns: null, 
      columns: this.getColumns(), 
      pagination: { 
        page: 1,
        perPage: 5
      }
    };

    this.onRow = this.onRow.bind(this);
    this.onRowSelected = this.onRowSelected.bind(this);
    this.onColumnChange = this.onColumnChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onPerPage = this.onPerPage.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onToggleColumn = this.onToggleColumn.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }
  getColumns() {
    const editable = edit.edit({
      isEditing: ({ columnIndex, rowData }) => columnIndex === rowData.editing,
      onActivate: ({ columnIndex, rowData }) => {
        const index = findIndex(this.state.rows, { id: rowData.id });
        const rows = cloneDeep(this.state.rows);

        rows[index].editing = columnIndex;

        this.setState({ rows });
      },
      onValue: ({ value, rowData, property }) => {
        const index = findIndex(this.state.rows, { id: rowData.id });
        const rows = cloneDeep(this.state.rows);

        rows[index][property] = value;
        rows[index].editing = false;

        this.setState({ rows });
      }
    });
    const sortable = sort.sort({
      getSortingColumns: () => this.state.sortingColumns || [],
      onSort: selectedColumn => {
        this.setState({
          sortingColumns: sort.byColumns({ // sort.byColumn would work too
            sortingColumns: this.state.sortingColumns,
            selectedColumn
          })
        });
      }
    });
    const sortableHeader = sortHeader(sortable, () => this.state.sortingColumns);
    const resize = resizable.column({
      getWidth: column => column.header.props.style.width,
      onDrag: (width, { columnIndex }) => {
        const columns = this.state.columns;
        const column = columns[columnIndex];

        column.header.props.style = {
          ...column.header.props.style,
          width
        };

        this.setState({ columns });
      }
    });

    return [
      {
        property: 'placa',
        header: {
          label: 'Placa',
          formatters: [
            (name, extraParameters) => resize(
              <div style={{ display: 'inline' }}>
                <input
                  type="checkbox"
                  onClick={() => console.log('clicked')}
                  style={{ width: '20px' }}
                />
                {sortableHeader(name, extraParameters)}
              </div>,
              extraParameters
            )
          ],
          props: {
            style: {
              width: 200
            }
          }
        },
        cell: {
          transforms: [
            editable(edit.input())
          ],
          formatters: [
            search.highlightCell
          ]
        },
        footer: () => 'You could show sums etc. here in the customizable footer.',
        visible: true
      },
      {
        property: 'modelo',
        header: {
          label: 'Modelo',
          formatters: [
            (v, extra) => resize(sortableHeader(v, extra), extra)
          ],
          props: {
            style: {
              width: 100
            }
          }
        },
        cell: {
          transforms: [
            editable(edit.input())
          ],
          formatters: [
            search.highlightCell
          ]
        },
        visible: true
      },
      {
        property: 'marca',
        header: {
          label: 'Marca',
          formatters: [
            sortableHeader
          ],
          props: {
            style: {
              width: 100
            }
          }
        },
        cell: {
          transforms: [
            editable(edit.input())
          ]
        },
        visible: true
      },
      {
        property: 'imagem',
        header: {
          label: 'Foto',
          formatters: [
            sortableHeader
          ],
          props: {
            style: {
              width: 100
            }
          }
        },
        cell: {
			transforms: [editable(edit.input())]
        },
        visible: true
      },
      {
        property: 'combustivel',
        header: {
          label: 'Combustivel',
          formatters: [
            sortableHeader
          ],
          props: {
            style: {
              width: 100
            }
          }
        },
        cell: {
			transforms: [editable(edit.input())]
        },
        visible: true
      },
            {
        property: 'valor',
        header: {
          label: 'Valor',
          formatters: [
            sortableHeader
          ],
          props: {
            style: {
              width: 100
            }
          }
        },
        cell: {
          transforms: [editable(edit.input({ props: { type: 'number' } }))]
        },
        visible: true
      },
      {
        props: {
          style: {
            width: 50
          }
        },
        cell: {
          formatters: [
            (value, { rowData }) => (
              <span
                className="remove"
                onClick={() => this.onRemove(rowData.id)} style={{ cursor: 'pointer' }}
              >
                &#10007;
              </span>
            )
          ]
        },
        visible: true
      }
    ];
  }
  render() {
    const {
      columns, rows, pagination, sortingColumns, searchColumn, query
    } = this.state;
    const cols = columns.filter(column => column.visible);
    const paginated = compose(
      paginate(pagination),
      sort.sorter({ columns: cols, sortingColumns, sort: orderBy }),
      search.highlighter({ columns: cols, matches: search.matches, query }),
      search.multipleColumns({ columns: cols, query }),
      resolve.resolve({
        columns: cols,
        method: (extra) => compose(
          resolve.byFunction('cell.resolve')(extra),
          resolve.nested(extra)
        )
      })
    )(rows);

    return (
      <div>
      	<button type="button" onClick={this.onAdd}>Novo Carro</button>
        <PrimaryControls
          className="controls"
          perPage={pagination.perPage}
          column={searchColumn}
          query={query}
          columns={cols}
          rows={rows}
          onPerPage={this.onPerPage}
          onColumnChange={this.onColumnChange}
          onSearch={this.onSearch}
        />

        <Table.Provider
          className="pure-table pure-table-striped"
          columns={cols}
          style={{ overflowX: 'auto' }}
        >
          <Table.Header>
            <search.Columns query={query} columns={cols} onChange={this.onSearch} />
          </Table.Header>

          <Table.Body onRow={this.onRow} rows={paginated.rows} rowKey="id" />

          <CustomFooter columns={cols} rows={paginated.rows} />
        </Table.Provider>

        <div className="controls">
          <Paginator
            pagination={pagination}
            pages={paginated.amount}
            onSelect={this.onSelect}
          />
        </div>
      </div>
    );
  }
  onRow(row, { rowIndex }) {
    return {
      onClick: () => this.onRowSelected(row)
    };
  }
  onRowSelected(row) {
    console.log('clicked row', row);
  }
  onColumnChange(searchColumn) {
    this.setState({
      searchColumn
    });
  }
  onSearch(query) {
    this.setState({
      query
    });
  }
  onSelect(page) {
    const pages = Math.ceil(
      this.state.rows.length / this.state.pagination.perPage
    );

    this.setState({
      pagination: {
        ...this.state.pagination,
        page: Math.min(Math.max(page, 1), pages)
      }
    });
  }
  onPerPage(value) {
    this.setState({
      pagination: {
        ...this.state.pagination,
        perPage: parseInt(value, 10)
      }
    });
  }
  onRemove(id) {
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });

    // this could go through flux etc.
    rows.splice(idx, 1);

    this.setState({ rows });
  }
  onAdd(e) {
    e.preventDefault();

    const rows = cloneDeep(this.state.rows);

    rows.unshift({
      id: uuid.v4(),
      name: 'Digite o nome'
    });

    this.setState({ rows });
  }
  onToggleColumn({ columnIndex }) {
    const columns = cloneDeep(this.state.columns);
    const column = columns[columnIndex];

    column.visible = !column.visible;

    const query = cloneDeep(this.state.query);
    delete query[column.property];

    this.setState({ columns, query });
  }
}

const CustomFooter = ({ columns, rows }) => {
  return (
    <tfoot>
      <tr>
        {columns.map((column, i) =>
          <td key={`footer-${i}`}>{column.footer ? column.footer(rows) : null}</td>
        )}
      </tr>
    </tfoot>
  );
}

function sortHeader(sortable, getSortingColumns) {
  return (value, { columnIndex }) => {
    const sortingColumns = getSortingColumns() || [];

    return (
      <div style={{ display: 'inline' }}>
        <span className="value">{value}</span>
        {React.createElement(
          'span',
          sortable(
            value,
            {
              columnIndex
            },
            {
              style: { float: 'right' }
            }
          )
        )}
        {sortingColumns[columnIndex] &&
          <span className="sort-order" style={{ marginLeft: '0.5em', float: 'right' }}>
            {sortingColumns[columnIndex].position + 1}
          </span>
        }
      </div>
    );
  };
}



ReactDOM.render( <AllFeaturesTable />, app);