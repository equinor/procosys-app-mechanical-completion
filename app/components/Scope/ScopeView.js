import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import propTypes from 'prop-types';
import colors from '../../stylesheets/colors';
import ScopeList from './ScopeList';
import Analytics from '../../services/AnalyticsService';
import Spinner from '../Spinner';
import Icon from 'react-native-vector-icons/Ionicons';
import RadioGroup from '../RadioGroup';
import Checkbox from '../Checkbox';
import ModalDropdown from '../ModalDropdown';

const Signatures = {
  ALL: 'All',
  NOT_SIGNED: 'Not Signed',
  SIGNED_NOT_VERIFIED: 'Signed, not verified'
};

signatureRadioButtonLabels = [
  { label: Signatures.ALL },
  { label: Signatures.NOT_SIGNED },
  { label: Signatures.SIGNED_NOT_VERIFIED }
];

const FormularGroups = {
  ALL: 'All',
  PRESERVATION: 'Preservation',
  MC_SCOPE: 'MC Scope'
}
scopeRadioButtonLabels = [
  { label: FormularGroups.ALL },
  { label: FormularGroups.MC_SCOPE },
  { label: FormularGroups.PRESERVATION }
];

/**
 * Renders a scope given a result and filters
 *
 * @example
 * <ScopeView
 *        onSelect={(item) => {}}
 *        result={theScoperesult}
 *        availableFormTypes={availableFormTypesInScopeList}
 *        availableResponsibleCodes={availableResponsibleCodesInScopeList}
 *        availableStatusList={availableStatusListInScopeList}
 *        scopeFilter={false} // Preservation FormularGroup
 * />
 *
 * @class ScopeView
 * @extends {React.PureComponent}
 */
class ScopeView extends React.PureComponent {

  constructor(props) {
    super(props);
    this.filterSignatures = this.filterSignatures.bind(this);

    this.state = {
      result: props.result,
      showFilter: false,
      statusFilter: [],
      availableStatusList: props.availableStatusList,
      availableFormTypes: props.availableFormTypes,
      availableResponsibleCodes: props.availableResponsibleCodes,
      signaturesFilter: Signatures.ALL,
      formularGroupFilter: FormularGroups.ALL,
      responsibleFilter: null,
      formTypeFilter: null,
      filterCount: 0
    };
  }

  filterResult() {
    let result = [...this.props.result];
    let filterCount = 0;

    // Filter based on status:
    if (this.state.statusFilter.length > 0) {
      result = result.filter(item => {
        return this.state.statusFilter.indexOf(item.Status) != -1;
      });
      filterCount++;
    }

    // Filter based on Radiobuttons
    switch (this.state.signaturesFilter) {
      case Signatures.NOT_SIGNED:
        result = result.filter(item => {
          return !item.IsSigned;
        });
        filterCount++;
        break;
      case Signatures.SIGNED_NOT_VERIFIED:
        result = result.filter(item => {
          return !item.IsVerified && item.IsSigned;
        });
        filterCount++;
        break;
      default:
      //no-op
    }

    // Filter based on Radiobuttons
    switch (this.state.formularGroupFilter) {
      case FormularGroups.MC_SCOPE:
        result = result.filter(item => {
          return item.FormularGroup.toLowerCase() == "mccr";
        });
        filterCount++;
        break;
      case FormularGroups.PRESERVATION:
        result = result.filter(item => {
          return item.FormularGroup.toLowerCase() == "preservation";
        });
        filterCount++;
        break;
      default:
      //no-op
    }

    // Filter based on Form Type
    if (this.state.formTypeFilter) {
      result = result.filter(item => {
        return item.FormularType === this.state.formTypeFilter;
      });
      filterCount++;
    }

    // Filter based on Responsible
    if (this.state.responsibleFilter) {
      result = result.filter(item => {
        return item.ResponsibleCode === this.state.responsibleFilter;
      });
      filterCount++;
    }

    this.setState({
      result: result,
      filterCount: filterCount
    });
  }

  onSelectCheckbox(status) {
    Analytics.FILTER_ACTIVATED('Scope_StatusFilter');

    let currentFilter = [...this.state.statusFilter];
    const exists = currentFilter.indexOf(status);

    if (exists != -1) {
      currentFilter.splice(exists - 1, 1);
    } else {
      currentFilter.push(status);
    }

    this.setState(
      {
        statusFilter: currentFilter
      },
      this.filterResult
    );
  }

  filterSignatures(index, group) {
    Analytics.FILTER_ACTIVATED('Scope_SignaturesFilter');
    this.setState(
      {
        signaturesFilter: signatureRadioButtonLabels[index].label
      },
      this.filterResult
    );
  }

  filterFormularGroup = (index, group) =>  {
    Analytics.FILTER_ACTIVATED('Scope_FormularGroupFilter');
    this.setState(
      {
        formularGroupFilter: scopeRadioButtonLabels[index].label
      },
      this.filterResult
    );
  }

  renderFilter() {
    let checkboxes = this.state.availableStatusList.map(item => {
      let isChecked = this.state.statusFilter.indexOf(item) != -1;
      return (
        <Checkbox
          style={{ paddingVertical: 10, paddingRight: 30}}
          key={`checkbox_${item}`}
          label={item}
          checked={isChecked}
          onPress={() => this.onSelectCheckbox(item)}
        />
      );
    });

    let initialSignatureIndex = 0;

    if (this.state.signaturesFilter) {
      signatureRadioButtonLabels.some((element, index) => {
        if (element.label == this.state.signaturesFilter) {
          initialSignatureIndex = index;
          return true;
        }
      });
    }

    let initialFormularGroupIndex = 0;

    if (this.state.signaturesFilter && this.props.scopeFilter) {
      scopeRadioButtonLabels.some((element, index) => {
        if (element.label == this.state.formularGroupFilter) {
          initialFormularGroupIndex = index;
          return true;
        }
      });
    }

    let formularTypePickerItems = [{label: "Select", value: null}]
    this.state.availableFormTypes.map(
      formType => {
        formularTypePickerItems.push({label: formType, value: formType});
      }
    );
    let responsiblePickerItems = [{label: "Select", value: null}]
    this.state.availableResponsibleCodes.map(
      responsibleCode => {
        responsiblePickerItems.push({label: responsibleCode, value: responsibleCode});
      }
    );

    return (
      <View style={filterStyle.filterContainer}>
        <TouchableOpacity
          style={filterStyle.filterTextContainer}
          onPress={() => this.setState({ showFilter: !this.state.showFilter })}
        >
          <Text
            style={[
              filterStyle.filterText,
              this.state.showFilter && filterStyle.filterTextExpanded,
              this.state.filterCount > 0 && filterStyle.active
            ]}
          >
            {this.state.showFilter ? 'Hide' : 'Show'} filter{' '}
            {this.state.filterCount <= 0 ? '' : `(${this.state.filterCount})`}
          </Text>
          <Icon
            name={
              this.state.showFilter ? 'ios-arrow-down' : 'ios-arrow-forward'
            }
            size={18}
          />
        </TouchableOpacity>
        {this.state.showFilter && (
          <View style={filterStyle.filterContentContainer}>
            <View style={filterStyle.filterSectionContainer}>
              <Text style={filterStyle.filterLabel}>Status</Text>
              <View style={{flexDirection: 'row'}}>
                {checkboxes}
              </View>
            </View>
            {this.props.scopeFilter && (
              <View style={filterStyle.filterSectionContainer}>
                <Text style={filterStyle.filterLabel}>Scope</Text>

                <RadioGroup
                  style={{paddingVertical: 10}}
                  onChange={this.filterFormularGroup}
                  initialIndex={initialFormularGroupIndex}
                  data={scopeRadioButtonLabels}
                />
              </View>
            )}
            <View style={filterStyle.filterSectionContainer}>
              <Text style={filterStyle.filterLabel}>Signatures</Text>

              <RadioGroup
                style={{paddingVertical: 10}}
                onChange={this.filterSignatures}
                initialIndex={initialSignatureIndex}
                data={signatureRadioButtonLabels}
              />
            </View>
            <View style={filterStyle.filterSectionContainer}>
              <Text style={filterStyle.filterLabel}>Responsible</Text>
              <View style={filterStyle.pickerContainer}>
                <ModalDropdown 
                  fullWidth={true}
                  options={this.state.availableResponsibleCodes}
                  onSelect={(itemIndex) => {
                    Analytics.FILTER_ACTIVATED('Scope_ResponsibleFilter');
                    this.setState({
                      responsibleFilter: this.state.availableResponsibleCodes[itemIndex]
                    }, this.filterResult)
                  }}
                  defaultValue={this.state.responsibleFilter || "Select"}
                  id="Responsible"
                />
              </View>
            </View>
            <View style={filterStyle.filterSectionContainer}>
              <Text style={filterStyle.filterLabel}>Form Type</Text>
              <View style={filterStyle.pickerContainer}>
                <ModalDropdown 
                    fullWidth={true}
                    options={this.state.availableFormTypes}
                    onSelect={(itemIndex) => {
                      Analytics.FILTER_ACTIVATED('Scope_FormularTypeFilter');
                      this.setState({
                        formTypeFilter: this.state.availableFormTypes[itemIndex]
                      }, this.filterResult)
                    }}
                    defaultValue={this.state.formTypeFilter || "Select"}
                  />
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          {this.renderFilter()}
          <View style={styles.content}>
            <View style={styles.resultContainer}>
              <ScopeList
                result={this.state.result}
                totalResults={this.state.result.length}
                onSelect={this.props.onSelect}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const filterStyle = StyleSheet.create({
  filterTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  filterText: {
    fontSize: 18,
    marginRight: 10
  },
  filterTextExpanded: {
    color: '#3A85B3'
  },
  active: {
    color: '#FF1243'
  },
  filterContentContainer: {
    marginTop: 15
  },
  filterContainer: {
    marginBottom: 16
  },
  filterSectionContainer: {
    marginTop: 10
  },
  filterLabel: {
    marginBottom: 8,
    fontWeight: '500'
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderWidth: StyleSheet.hairlineWidth
  }
});

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: colors.PAGE_BACKGROUND
  },
  scrollContainer: {
    flex: 1
  },
  content: {
    flex: 1,
  }
});

ScopeView.propTypes = {
  navigation: propTypes.shape({
    state: propTypes.shape({
      params: propTypes.shape({
        item: propTypes.object.isRequired
      })
    })
  })
};

export default ScopeView;
