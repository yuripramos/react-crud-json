import ReactDOM from "react-dom";
import Header from "./layout/header";

import React from 'react';
import { compose, createStore } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep, findIndex } from 'lodash';
import * as Table from 'reactabular-table';
import * as edit from 'react-edit';
import uuid from 'uuid';

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

const actions = {
  createRow: () => ({
    type: 'CREATE_ROW',
    row: { name: 'Digite um novo nome', id: uuid.v4() }
  }),
  deleteRow: id => ({
    type: 'DELETE_ROW',
    row: { id }
  }),
  editRow: (columnIndex, id) => ({
    type: 'EDIT_ROW',
    row: { columnIndex, id }
  }),
  confirmEdit: (property, value, id) => ({
    type: 'CONFIRM_EDIT',
    row: { property, value, id }
  })
};

const reducer = (state, action) => {
  const row = action.row;
  const index = row && findIndex(state, { id: row.id });

  switch (action.type) {
    case 'CREATE_ROW':
      return [row].concat(state);

    case 'DELETE_ROW':
      if (index >= 0) {
        return state.slice(0, index).concat(state.slice(index + 1));
      }

    case 'EDIT_ROW':
      if (index >= 0) {
        return editProperty(state, index, {
          editing: row.columnIndex
        });
      }

    case 'CONFIRM_EDIT':
      if (index >= 0) {
        return editProperty(state, index, {
          [row.property]: row.value,
          editing: false
        });
      }

    default:
      return state;
  }

  return state;
};

function editProperty(rows, index, values) {
  // Skip mutation, there's likely a neater way to achieve this
  const ret = cloneDeep(rows);

  Object.keys(values).forEach(v => {
    ret[index][v] = values[v];
  });

  return ret;
}

const store = createStore(reducer, rows);

class CRUDTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns() // initial columns
    };
  }
  getColumns() {
    const editable = edit.edit({
      isEditing: ({ columnIndex, rowData }) => columnIndex === rowData.editing,
      onActivate: ({ columnIndex, rowData }) => {
        this.props.editRow(columnIndex, rowData.id);
      },
      onValue: ({ value, rowData, property }) => {
        this.props.confirmEdit(property, value, rowData.id);
      }
    });

    return [
      {
        property: 'placa',
        header: {
          label: 'Placa'
        },
        cell: {
          transforms: [editable(edit.input())]
        }
      },
      {
        property: 'modelo',
        header: {
          label: 'Modelo'
        },
        cell: {
          transforms: [editable(edit.input())]
        }
      },
      {
        property: 'marca',
        header: {
          label: 'Marca'
        },
        cell: {
          transforms: [editable(edit.input())]
        }
      },
      {
        property: 'imagem',
        header: {
          label: 'Foto'
        },
        cell: {
          transforms: [editable(edit.input())]
        }
      },
      {
        property: 'combustivel',
        header: {
          label: 'Combustivel'
        },
        cell: {
          transforms: [editable(edit.input())]
        }
      },
      {
        property: 'valor',
        header: {
          label: 'Valor'
        },
        cell: {
          transforms: [editable(edit.input({ props: { type: 'number' } }))]
        }
      },


      // {
      //   property: 'active',
      //   header: {
      //     label: 'Active'
      //   },
      //   cell: {
      //     transforms: [editable(edit.boolean())],
      //     formatters: [active => active && <span>&#10003;</span>]
      //   }
      // },
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
                onClick={() => this.props.deleteRow(rowData.id)} style={{ cursor: 'pointer' }}
              >
                &#10007;
              </span>
            )
          ]
        }
      }
    ];
  }
  render() {
    const { rows } = this.props;
    const { columns } = this.state;

    return (
      <div className="container">
          <Header />
      <td><button type="button" onClick={e => {
          e.preventDefault();

          this.props.createRow();
        }}>Add new</button></td>
          <div className="wrapper">
            <Table.Provider
              className="pure-table pure-table-striped"
              columns={columns}
            >
              <Table.Header />

              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>

              <Table.Body rows={rows} rowKey="id" />
            </Table.Provider>
          </div>
        </div>
    );
  }
}

const ConnectedCRUDTable = connect(
  rows => ({ rows }),
  actions
)(CRUDTable);

ReactDOM.render( <ConnectedCRUDTable store={store} />, app);
