import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import propTypes from 'prop-types';
import AutoSubmitTextInput from '../../components/AutoSubmitTextInput/AutoSubmitTextInput';

/**
 * @example
 * <MetaTable 
 *  data={[items]} 
 *  onUpdateMetaTableColumn={(rowId, columnId, value) => {}} 
 * />
 */
class MetaTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.renderColumn = this.renderColumn.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.getTitleForColumnId = this.getTitleForColumnId.bind(this);
  }

  getTitleForColumnId(id) {
    let result = this.props.data.ColumnLabels.find(
      (column, index) => column.Id === id
    );
    if (result) {
      return result.Label;
    }
    return '';
  }

  renderColumn(column, index, row) {
    const columnHeading = this.getTitleForColumnId(column.ColumnId);
    return (
      <View style={styles.columnContainer} key={`metaTableColumnCell_${index}`}>
        <View style={styles.columnHeadingContainer}>
          <Text style={styles.columnHeadingText}>{columnHeading}</Text>
        </View>
        <View style={styles.inputAndTextContainer}>
          <View style={styles.inputContainer}>
            <AutoSubmitTextInput text={column.Value || ""} style={styles.input} delay={5000} minLengthBeforeSubmit={0} onSubmit={(newValue) => this.props.onUpdateMetaTableColumn(row.Id, column.ColumnId,newValue)} disabled={this.props.disabled} />
          </View>
          <View style={styles.unitContainer}>
            <Text style={styles.unitText}>{column.Unit}</Text>
          </View>
        </View>
      </View>
    );
  }

  renderRow(row, rowIndex) {
    let tempColumnList = [];
    let cells = row.Cells.map((cell, index) => {
      let column = this.renderColumn(cell, index, row);
      let tmpComponent = null;
      tempColumnList.push(column);

      if (
        (index === row.Cells.length - 1 && index % 2 != 0) ||
        (1 + index) % 2 === 0
      ) {
        tmpComponent = (
          <View style={styles.columnRow} key={`metaTableColumn_${index}`}>
            {tempColumnList}
          </View>
        );
        tempColumnList = [];
      } else if (row.Cells.length === 1) {
        tmpComponent = (<View style={styles.columnRow} key={`metaTableColumn_${index}`}>
            {tempColumnList}
        </View>)
      }

      if (tmpComponent) {
        return tmpComponent;
      }
    });

    return (
      <View style={styles.row} key={`metaTableRow_${rowIndex}`}>
        <View style={styles.rowHeadingContainer}>
          <Text style={styles.rowHeadingText}>{row.Label}</Text>
        </View>
        <View style={styles.cellContainer}>{cells}</View>
      </View>
    );
  }

  render() {
    let rows = this.props.data.Rows.map((row, index) =>
      this.renderRow(row, index)
    );
    return <View style={styles.container}>{rows}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 20
  },
  row: {
    paddingTop: 10
  },
  rowHeadingContainer: {},
  rowHeadingText: {
    fontWeight: 'bold'
  },
  columnContainer: { flex: 1 },
  columnRow: { flexDirection: 'row', marginTop: 5 },
  columnHeadingContainer: {
    marginBottom: 3
  },
  columnHeadingText: {},
  inputAndTextContainer: { flexDirection: 'row', alignItems: 'center' },
  inputContainer: {
    flex: 2
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    margin: 2,
    padding: 5
  },
  unitContainer: {
    flex: 1
  },
  unitText: {
    paddingLeft: 5,
    paddingRight: 5
  }
});

MetaTable.propTypes = {
  disabled: propTypes.bool,
  data: propTypes.shape({
    ColumnLabels: propTypes.arrayOf(
      propTypes.shape({
        Id: propTypes.number.isRequired,
        Label: propTypes.string
      })
    ).isRequired,
    Info: propTypes.string,
    Rows: propTypes.arrayOf(
      propTypes.shape({
        Cells: propTypes.arrayOf(
          propTypes.shape({
            ColumnId: propTypes.number.isRequired,
            Unit: propTypes.string,
            Value: propTypes.string
          })
        ),
        Id: propTypes.number.isRequired,
        Label: propTypes.string
      }).isRequired
    )
  })
};

MetaTable.defaultProps = {
  data: {},
  disabled: false
};

export default MetaTable;
