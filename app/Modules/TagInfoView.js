import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ApiService from '../services/api';
import Spinner from '../components/Spinner';

class TagInfoView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tagInfo: null,
      additionalFields: []
    }
  }

  componentDidMount() {
    let tagId = this.props.tagId;

    ApiService.getTagInfo(tagId).then(response => {
      this.setState({
        tagInfo: response.Tag,
        additionalFields: response.AdditionalFields
      })
    })
  }

  renderInfo(title, value) {
    //Used for values where we concatenate strings.
    if (value === "null" || (value && value.trim() === "")) {
      value = null;
    }

    return (
      <View style={styles.infoItemContainer} key={title}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{value || "-"}</Text>
        </View>
      </View>
    )
  }

  render() {
    if (!this.state.tagInfo) {
      return (<Spinner text="Loading tag information" />)
    }
    let infoItems = [];
    const tagInfo = this.state.tagInfo;
    const additionalFields = this.state.additionalFields;
    
    additionalFields.map(field => {
      infoItems.push(this.renderInfo(field.Label, `${field.Value || ''} ${field.Unit || ''}`));
    })
    
    return (
        <View style={{flex: 1}}>
          {this.renderInfo("Tag No", tagInfo.TagNo)}
          {this.renderInfo("Description", tagInfo.Description)}
          {this.renderInfo("Register", `${tagInfo.RegisterCode}, ${tagInfo.RegisterDescription}`)}
          {this.renderInfo("Tag function", tagInfo.TagFunctionCode && `${tagInfo.TagFunctionCode}, ${tagInfo.TagFunctionDescription}`)}
          {this.renderInfo("System", tagInfo.SystemCode && `${tagInfo.SystemCode}, ${tagInfo.SystemDescription}`)}
          {this.renderInfo("Sequence", tagInfo.Sequence)}
          {this.renderInfo("Discipline", tagInfo.DisciplineCode && `${tagInfo.DisciplineCode}, ${tagInfo.DisciplineDescription}`)}
          {this.renderInfo("Area", tagInfo.AreaCode && `${tagInfo.AreaCode}, ${tagInfo.AreaDescription}`)}
          {this.renderInfo("Project", tagInfo.ProjectDescription)}
          {this.renderInfo("MC Pkg", tagInfo.McPkgNo)}
          {this.renderInfo("Purchase order", tagInfo.PurchaseOrderTitle)}
          {this.renderInfo("Status", `${tagInfo.StatusCode}, ${tagInfo.StatusDescription}`)}
          {this.renderInfo("Engineering Code", tagInfo.EngineeringCodeCode && `${tagInfo.EngineeringCodeCode}, ${tagInfo.EngineeringCodeDescription}`)}
          {this.renderInfo("Contractor", tagInfo.ContractorCode && `${tagInfo.ContractorCode}, ${tagInfo.ContractorDescription}`)}
          {this.renderInfo("Mounted on", tagInfo.MountedOnTagNo)}
          {this.renderInfo("Remark", tagInfo.Remark)}
          <View style={styles.infoItemContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.headerText}>Details</Text>
            </View>
          </View>
          {infoItems}
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  infoItemContainer: {
    flexDirection: 'row',
    padding: 15
  },
  valueContainer: {
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    marginRight: 15
  },
  headerText: {
    fontWeight: '500',
    fontSize: 22
  },
  titleText: {
    color: '#B79199',
    fontSize: 16
  },
  valueText: {
    fontSize: 16
  }
})

export default TagInfoView;
