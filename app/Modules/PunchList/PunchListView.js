import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import propTypes from 'prop-types';
import colors from '../../stylesheets/colors';
import PunchItemList from './PunchItemList';
import Icon from 'react-native-vector-icons/Ionicons';
import RadioGroup from '../../components/RadioGroup';
import ModalDropdown from '../../components/ModalDropdown';
import Analytics from '../../services/AnalyticsService';

const Signatures = {
  ALL: 'All',
  NOT_CLEARED: 'Not cleared',
  CLEARED_NOT_VERIFIED: 'Cleared, not verified'
};

const Status = {
  ALL: 'All',
  PA: 'PA',
  PB: 'PB'
};

const signaturesRadioButtonLabels = [
  { label: Signatures.ALL },
  { label: Signatures.NOT_CLEARED },
  { label: Signatures.CLEARED_NOT_VERIFIED }
];

const statusRadioButtonLabels = [
  { label: Status.ALL },
  { label: Status.PA },
  { label: Status.PB }
];

/**
 * Renders a list of punch items
 *
 * @example
 * <PunchListView
 *        onSelect={(item) => {}}
 *        items={[PunchListItem1,PunchListItem2]}
 * />
 *
 * @class PunchListView
 * @extends {React.PureComponent}
 */
class PunchListView extends React.PureComponent {

  constructor(props) {
    super(props);
    this.filterSignatures = this.filterSignatures.bind(this);
    this.filterStatus = this.filterStatus.bind(this);
    this.updateFilterProperties = this.updateFilterProperties.bind(this);

    this.state = {
      visibleItems: [],
      showFilter: false,
      statusFilter: Status.ALL,
      availableResponsibleCodes: [],
      availableFormularTypes: [],
      signaturesFilter: Signatures.ALL,
      formularTypeFilter: null,
      responsibleCodeFilter: null,
      filterCount: 0
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.items.length != this.props.items.length) {
      this.updateFilterProperties();
      this.filterResult();
    }
  }

  componentDidMount() {
    this.updateFilterProperties();
    this.filterResult();
  }

  updateFilterProperties() {
    let uniqueFormularTypes = [];
    let uniqueResponsibleCodes = [];

    this.props.items.map(item => {
      if (uniqueFormularTypes.indexOf(item.FormularType) == -1) {
        uniqueFormularTypes.push(item.FormularType);
      }
      if (uniqueResponsibleCodes.indexOf(item.ResponsibleCode) == -1) {
        uniqueResponsibleCodes.push(item.ResponsibleCode)
      }
    });
    
    this.setState({
      availableResponsibleCodes: uniqueResponsibleCodes,
      availableFormularTypes: uniqueFormularTypes
    });
  }

  filterResult() {
    let result = [...this.props.items];
    let filterCount = 0;

    // Filter based on Status Radiobuttons
    switch(this.state.statusFilter) {
      case Status.PA: 
        result = result.filter(item => item.Status === Status.PA);
        Analytics.FILTER_ACTIVATED('Punch_StatusFilter');
        filterCount++;
        break;
      case Status.PB: 
        result = result.filter(item => item.Status === Status.PB);
        filterCount++;
        break;
      default:
        //No operation, Status.ALL is selected
    }

    // Filter based on Signature Radiobuttons
    switch (this.state.signaturesFilter) {
      case Signatures.NOT_CLEARED:
        result = result.filter(item => {
          return !item.Cleared;
        });
        filterCount++;
        break;
      case Signatures.CLEARED_NOT_VERIFIED:
        result = result.filter(item => {
          return !item.Verified && item.Cleared;
        });
        filterCount++;
        break;
      default:
      //no-op
    }

    if (this.state.formularTypeFilter) {
      result = result.filter(item => {
        return item.FormularType === this.state.formularTypeFilter;
      });
      filterCount++;
    }

    // Filter based on Responsible
    if (this.state.responsibleCodeFilter) {
      result = result.filter(item => {
        return item.ResponsibleCode === this.state.responsibleCodeFilter;
      });
      filterCount++;
    }

    this.setState({
      visibleItems: result,
      filterCount: filterCount
    });
  }

  filterStatus(index) {
    Analytics.FILTER_ACTIVATED('Punch_StatusFilter');
    this.setState({
      statusFilter: statusRadioButtonLabels[index].label
    }, this.filterResult);
  }

  filterSignatures(index) {
    Analytics.FILTER_ACTIVATED('Punch_SignaturesFilter');
    this.setState(
      {
        signaturesFilter: signaturesRadioButtonLabels[index].label
      },
      this.filterResult
    );
  }

  renderFilter() {

    let initialStatusIndex = 0;

    if (this.state.statusFilter) {
      statusRadioButtonLabels.some((element, index) => {
        if (element.label == this.state.statusFilter) {
          initialStatusIndex = index;
          return true;
        }
      });
    }

    let initialSignatureIndex = 0;

    if (this.state.signaturesFilter) {
      signaturesRadioButtonLabels.some((element, index) => {
        if (element.label == this.state.signaturesFilter) {
          initialSignatureIndex = index;
          return true;
        }
      });
    }

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
              <View style={filterStyle.inlineContentContainer}>
                <RadioGroup
                  style={{paddingVertical: 10}}
                  onChange={this.filterStatus}
                  initialIndex={initialStatusIndex}
                  data={statusRadioButtonLabels}
                  />
              </View>
            </View>
            <View style={filterStyle.filterSectionContainer}>
              <Text style={filterStyle.filterLabel}>Signatures</Text>

              <RadioGroup
                style={{paddingVertical: 10}}
                onChange={this.filterSignatures}
                initialIndex={initialSignatureIndex}
                data={signaturesRadioButtonLabels}
              />
            </View>
            <View style={filterStyle.filterSectionContainer}>
              <Text style={filterStyle.filterLabel}>Responsible</Text>
              <View style={filterStyle.pickerContainer}>

              <ModalDropdown 
                  options={this.state.availableResponsibleCodes}
                  onSelect={(itemIndex) => {
                  Analytics.FILTER_ACTIVATED('Punch_ResponsibleTypeFilter');

                    this.setState({
                      responsibleCodeFilter: this.state.availableResponsibleCodes[itemIndex]
                    }, this.filterResult)
                  }}
                  defaultValue={this.state.responsibleCodeFilter || "Select"}
                  id="Responsible"
                  fullWidth
                />
              </View>
            </View>
            <View style={filterStyle.filterSectionContainer}>
              <Text style={filterStyle.filterLabel}>Form Type</Text>
              <View style={filterStyle.pickerContainer}>
              <ModalDropdown 
                  options={this.state.availableFormularTypes}
                  onSelect={(itemIndex) => {
                  Analytics.FILTER_ACTIVATED('Punch_FormularTypeFilter');
                    this.setState({
                      formularTypeFilter: this.state.availableFormularTypes[itemIndex]
                    }, this.filterResult)
                  }}
                  defaultValue={this.state.formularTypeFilter || "Select"}
                  fullWidth
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
        {this.renderFilter()}
        <View style={styles.content}>
          <View style={styles.resultContainer}>
            <PunchItemList
              items={this.state.visibleItems}
              totalResults={this.state.visibleItems.length}
              onSelect={this.props.onSelect}
            />
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
  filterContentContainer: {
    marginTop: 15
  },
  filterContainer: {
    margin: 15
  },
  active: {
    color: '#FF1243'
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
  },
  picker: {
    color: colors.TEXT_COLOR
  },
  inlineContentContainer: {
    flexDirection: 'row'
  }
});

const styles = StyleSheet.create({
  resultContainer: {
    flex:1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.PAGE_BACKGROUND
  },
  content: {
    flex: 1,
    padding: 15
  }
});

PunchListView.propTypes = {
  navigation: propTypes.shape({
    state: propTypes.shape({
      params: propTypes.shape({
        item: propTypes.object.isRequired
      })
    })
  })
};

export default PunchListView;
