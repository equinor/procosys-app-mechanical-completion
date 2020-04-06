import {
  ApiBaseUrl,
  ApiVersion,
  AzureADClientId,
  ApiResourceIdentifier
} from '../settings';
// import { getAccessToken } from '../Auth/userManager';
import Analytics from './AnalyticsService';
import AxiosGenerator from 'axios';
import Qs from 'qs';
import { ReactNativeAD } from 'react-native-azure-ad';
const getAccessToken = () => ReactNativeAD.getContext(AzureADClientId).assureToken(ApiResourceIdentifier);


const AxiosAuthenticated = () => {
  let axiosInstance = AxiosGenerator.create({
    baseURL: ApiBaseUrl,
    headers: {
      Authorization: '',
      "Content-Type": "application/json"
    },
    timeout: 1000 * 30,
    paramsSerializer: function(params) {
      return Qs.stringify(params, { arrayFormat: 'brackets' });
    }
  });

  axiosInstance.interceptors.request.use(
    async config => {
      let token = await getAccessToken();
      config.headers.Authorization = `Bearer ${token}`;
      if (!config.params) {
        config.params = {};
      }
      if (globalConfig.plant && !config.noPlant) {
        config.params.plantId = globalConfig.plant;
      }
      if (globalConfig.project && !config.noProject) {
        config.params.projectId = globalConfig.project;
      }
      config.params['api-version'] = ApiVersion;
      config.metadata = {
        startTime: new Date()
      }
      console.log('Running request with Axios Config: ', config);
      return config;
    },
    error => {
      console.log('Request error', error);
      return Promise.reject(error);
    }
  );
  
  // Axios by default gives us the string representation of a generic javascript error. We want to see what went wrong, response codes ++.
  // You could access this trough error.response, but that is not clear from the error itself.
  axiosInstance.interceptors.response.use(
    response => {
      response.config.metadata.endTime = new Date();
      response.config.metadata.duration = response.config.metadata.endTime - response.config.metadata.startTime;

      Analytics.trackEvent('API_REQUEST_COMPLETED', {
        path: response.config.url,
        responseTime: response.config.metadata.duration,
        status: response.status
      });
      console.log('API Response: ', response);
      return response;
    },
    function(error) {
      error.config.metadata.endTime = new Date();
      error.config.metadata.duration = error.config.metadata.endTime - error.config.metadata.startTime;

      Analytics.trackEvent('API_REQUEST_FAILED', {
        path: error.config.url,
        responseTime: error.config.metadata.duration,
        status: error.response.status
      });
      console.log('API Error: ', error);
      console.log('-> API Error Response: ', error.response);
      return Promise.reject(error.response);
    }
  );
  
  return axiosInstance;
} 

const globalConfig = { plant: null, project: null };

export function setPlant(plant) {
  globalConfig.plant = plant.Id;
}
export function setProject(project) {
  if (!project.Id) return;
  globalConfig.project = project.Id;
}


/**
 * Unwrap the result of a successfull request
 *
 * @param {Promise} axiosPromise
 * 
 * @returns {Promise<Object>}
 */
const returnDataOnly = axiosPromise => {
  return new Promise((resolve, reject) => {
    axiosPromise
      .then(result => {
        resolve(result.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

/**
 * Get all the plants for current user
 *
 * @returns {Promise<Object>}
 */
export const getPlants = () =>
  returnDataOnly(
    AxiosAuthenticated().get('/Plants', { noPlant: true, noProject: true })
  );

/**
 * Get all the projects for current user
 *
 */
export const getProjects = () =>
  returnDataOnly(AxiosAuthenticated().get('/Projects'));

/**
 * Get all supported API versions
 *
 * @returns {Promise<Object>}
 */
export const getSupportedApiVersions = () =>
  returnDataOnly(AxiosAuthenticated().get('/Versions'));

/**
 * Search for MC Packages starting with the given search term.
 *
 * @param {string} searchTerm
 * 
 * @returns {Promise<Object>}
 */
export const searchForMcPackage = searchTerm =>
  returnDataOnly(
    AxiosAuthenticated().get('/McPkg/Search', {
      params: { startsWithMcPkgNo: searchTerm }
    })
  );

/**
 * Search for WOs starting with the given search term.
 *
 * @param {string} searchTerm
 * 
 * @returns {Promise<Object>}
 */
export const searchForWo = searchTerm =>
  returnDataOnly(
    AxiosAuthenticated().get('/WorkOrder/Search', {
      params: { startsWithWorkOrderNo: searchTerm }
    })
  );

/**
 * Search for POs starting with the given search term.
 *
 * @param {string} poSearchTerm
 * @param {string} calloffSearchTerm
 */
export const searchForPo = (poSearchTerm, calloffSearchTerm) =>
  returnDataOnly(
    AxiosAuthenticated().get('/PurchaseOrder/Search', {
      params: { 
        startsWithPurchaseOrderNo: poSearchTerm,
        startsWithCallOffNo: calloffSearchTerm
      }
    })
  );

/**
 * Search for Tags starting with the given search term.
 *
 * @param {string} searchTerm
 * 
 * @returns {Promise<Object>}
 */
export const searchForTag = searchTerm =>
returnDataOnly(
  AxiosAuthenticated().get('/Tag/Search', {
    params: { startsWithTagNo: searchTerm }
  })
);

/**
 * Get checklists belonging to a given Work Order.
 *
 * @param {Number} workOrderId
 * 
 * @returns {Promise<Object>}
 */
export const getChecklistsForWorkOrder = workOrderId =>
  returnDataOnly(
    AxiosAuthenticated().get('/WorkOrder/CheckLists', {
      params: {
        workOrderId: workOrderId
      }
    })
  );

/**
 * Get checklists belonging to a given Purchase Order.
 *
 * @param {Number} callOffId
 * 
 * @returns {Promise<Object>}
 */
export const getChecklistsForPurchaseOrder = callOffId =>
  returnDataOnly(
    AxiosAuthenticated().get('/PurchaseOrder/CheckLists', {
      params: {
        callOffId: callOffId
      }
    })
  );

  /**
 * Get checklists belonging to a given Tag.
 *
 * @param {Number} tagId
 */
export const getChecklistsForTag = tagId =>
returnDataOnly(
  AxiosAuthenticated().get('/Tag/CheckLists', {
    params: {
      tagId: tagId,
      formularGroupsFilter: ["MCCR","Preservation"]
    }
  })
);

/**
 * Get checklists belonging to a given MC Package.
 *
 * @param {Number} mcPackageId
 * 
 * @returns {Promise<Object>}
 */
export const getChecklistsForMcPackage = mcPackageId =>
  returnDataOnly(
    AxiosAuthenticated().get('/McPkg/CheckLists', {
      params: {
        mcPkgId: mcPackageId
      }
    })
  );

  /**
 * Get checklist details for a given MC checklist.
 *
 * @param {Number} checklistId
 */
export const getChecklistDetailsForChecklist = checklistId =>
returnDataOnly(
  AxiosAuthenticated().get('/CheckList/MC', {
    params: {
      checkListId: checklistId
    }
  })
);

  /**
 * Get checklist details for a given MC checklist.
 *
 * @param {Number} checklistId
 */
export const getChecklistDetailsForPreservationChecklist = checklistId =>
returnDataOnly(
  AxiosAuthenticated().get('/CheckList/Preservation', {
    params: {
      checkListId: checklistId
    }
  })
);

export const setChecklistComment = (checklistId, comment) => {
  return AxiosAuthenticated().put('/CheckList/MC/Comment', {
    CheckListId: checklistId,
    Comment: comment
  });
}

/**
 * Set the checked status of a check item
 * 
 * Automatically handles Custom checkitems vs standard
 * 
 * @param {Number} checklistId
 * @param {Number} checkItemId
 * @param {Boolean} isOk default: false
 * @param {Boolean} isNa default: false
 * @param {Boolean} isCustom default: false
 * 
 * @returns Promise<AxiosResponse>()
 */
export const setCheckItemStatus = (
  checklistId,
  checkItemId,
  isOk = false,
  isNa = false,
  isCustom = false
) => {
  if (isCustom) {
    const data = {
      CustomCheckItemId: checkItemId,
      CheckListId: checklistId
    };

    if (!isOk) {
      return AxiosAuthenticated().post('/CheckList/CustomItem/Clear', data);
    } else {
      return AxiosAuthenticated().post('/CheckList/CustomItem/SetOk', data);
    }
  } else {
    const data = {
      CheckListId: checklistId,
      CheckItemId: checkItemId
    };

    if (isOk === isNa) {
      return AxiosAuthenticated().post('/CheckList/Item/Clear', data);
    } else if (isOk) {
      return AxiosAuthenticated().post('/CheckList/Item/SetOk', data);
    } else if (isNa) {
      return AxiosAuthenticated().post('/CheckList/Item/setNA', data);
    }
  }
};

/**
 * Get next available check item number.
 * @private
 * 
 * @param {Number} checklistId Checklist ID
 * 
 * @returns {Promise<AxiosResponse>} Promise<AxiosResponse>()
 */
const getNextAvailableCheckItemNumber = (checklistId) => {
  return AxiosAuthenticated().get("/CheckList/CustomItem/NextItemNo", {
    params: {
      checkListId: checklistId
    }
  });
}

/**
 * Add a custom check item to the given checklist
 * 
 * @param {Number} checklistId Checklist ID
 * @param {String} text Text to be inserted for custom check item
 * @param {Boolean} isOk Check item is checked
 * 
 * @returns {Promise<AxiosResponse>} Promise<AxiosResponse>()
 */
export const addCustomCheckItem = (checklistId, text, isOk = false) => {
  return getNextAvailableCheckItemNumber(checklistId).then(response => {
    return AxiosAuthenticated().post("/CheckList/CustomItem", {
      CheckListId: checklistId,
      ItemNo: response.data,
      Text: text,
      IsOk: isOk
    });
  });
}

/**
 * Delete a custom check item field
 * 
 * @param {Number} checklistId Checklist ID
 * @param {Number} checkItemId Check Item ID
 */
export const deleteCustomCheckItem = (checklistId, checkItemId) => {
  return AxiosAuthenticated().delete("/CheckList/CustomItem",{
    data: {
      CheckListId: checklistId,
      CustomCheckItemId: checkItemId
  }
  })
}

/**
 * Update value for metatable cell on any checkitem for any type of checklist
 * 
 * @param {Number} checklistId Checklist ID
 * @param {Number} checkitemId ChecklistItem ID
 * @param {Number} rowId ChecklistItem Metatable Row Id
 * @param {Number} columnId ChecklistItem Metatable Column Id
 * @param {String} value ChecklistItem Metatable Cell Value
 */
export const updateMetatableValueForChecklist = (checklistId, checkitemId, rowId, columnId, value) => {
  return AxiosAuthenticated().put('/CheckList/Item/MetaTableCell', {
      CheckListId: checklistId,
      CheckItemId: checkitemId,
      RowId: rowId,
      ColumnId: columnId,
      Value: value
  });
}

/**
 * Sign MC checklist
 * 
 * @param {Number} checklistId ID of MC checklist to be signed
 * 
 * @returns {Promise<AxiosResponse>} Promise<AxiosResponse>()
 */
export const signChecklist = (checklistId) => {
  return AxiosAuthenticated().post('/CheckList/MC/Sign', JSON.stringify(checklistId));
}

/**
 * Sign Preservation checklist
 * 
 * @param {Number} checklistId ID of preservation checklist to be signed
 * 
 * @returns {Promise<AxiosResponse>} Promise<AxiosResponse>()
 */
export const signPreservationChecklist = (checklistId) => {
  return AxiosAuthenticated().post('/CheckList/Preservation/Sign', JSON.stringify(checklistId));
}

/**
 * Unsign MC checklist
 * 
 * @param {Number} checklistId ID of MC checklist to be unsigned
 * 
 * @returns {Promise<AxiosResponse>} Promise<AxiosResponse>()
 */
export const unsignChecklist = (checklistId) => {
  return AxiosAuthenticated().post('/CheckList/MC/Unsign', JSON.stringify(checklistId));
}

/**
 * Unsign preservation checklist
 * 
 * @param {Number} checklistId ID of preservation checklist to be unsigned
 * 
 * @returns {Promise<AxiosResponse>} Promise<AxiosResponse>()
 */
export const unsignPreservationChecklist = (checklistId) => {
  return AxiosAuthenticated().post('/CheckList/Preservation/Unsign', JSON.stringify(checklistId));
}

/**
 * Verify MC checklist
 * 
 * @param {Number} checklistId ID of checklist to be verified
 * 
 * @returns {Promise<AxiosResponse>} Promise<AxiosResponse>()
 */
export const verifyChecklist = (checklistId) => {
  return AxiosAuthenticated().post('/CheckList/MC/Verify', JSON.stringify(checklistId));  
}

/**
 * Verify Preservation checklist
 * 
 * @param {Number} checklistId ID of checklist to be verified
 * 
 * @returns {Promise<AxiosResponse>} Promise<AxiosResponse>()
 */
export const verifyPreservationChecklist = (checklistId) => {
  return AxiosAuthenticated().post('/CheckList/Preservation/Verify', JSON.stringify(checklistId));  
}

/**
 * Unverify MC checklist
 * 
 * @param {Number} checklistId ID of checklist to be unverified
 * 
 * @returns {Promise<AxiosResponse>} Promise<AxiosResponse>()
 */
export const unverifyChecklist = (checklistId) => {
  return AxiosAuthenticated().post('/CheckList/MC/Unverify', JSON.stringify(checklistId));  
}

/**
 * Unverify Preservation checklist
 * 
 * @param {Number} checklistId ID of checklist to be unverified
 * 
 * @returns {Promise<AxiosResponse>} Promise<AxiosResponse>()
 */
export const unverifyPreservationChecklist = (checklistId) => {
  return AxiosAuthenticated().post('/CheckList/Preservation/Unverify', JSON.stringify(checklistId));  
}

/**
 * Check if there is any related checklists that can be used in a multisign request
 * 
 * @param {Number} checklistId ID of checklist to match
 * 
 * @returns {Promise<List<Object>>} A list of checklist Ids w/ tagNo and description
 */
export const canMultiSignChecklist = (checklistId) => {
  return returnDataOnly(AxiosAuthenticated().get('/CheckList/MC/CanMultiSign', {params: {checkListId: checklistId}}));  
}

/**
 * Check if there is any related checklists that can be used in a multiverify request
 * 
 * @param {Number} checklistId ID of checklist to match
 * 
 * @returns {Promise<List<Object>>} A list of checklist Ids w/ tagNo and description
 */
export const canMultiVerifyChecklist = (checklistId) => {
  return returnDataOnly(AxiosAuthenticated().get('/CheckList/MC/CanMultiVerify', {params: {checkListId: checklistId}}));  
}

/**
 * Multiverify checklist
 * 
 * @param {Number} checklistId ID of checklist to be verified
 * @param {Array<Number>} checklistIds List of Checklist IDs to verify
 * @returns {Promise<AxiosResponse>} Promise<AxiosResponse>()
 */
export const multiVerifyChecklist = (checklistId, checklistIds) => {
  return AxiosAuthenticated().post('/CheckList/MC/MultiVerify', {
    OriginalCheckListId: checklistId,
    TargetCheckListIds: checklistIds,
  });  
}

/**
 * Multisign checklist
 * 
 * @param {Number} checklistId ID of checklist to be signed
 * @param {Array<Number>} checklistIds List of Checklist IDs to sign
 * @returns {Promise<AxiosResponse>} Promise<AxiosResponse>()
 */
export const multiSignChecklist = (checklistId, checklistIds, copyMetaTable = false) => {
  return AxiosAuthenticated().post('/CheckList/MC/MultiSign', {
    OriginalCheckListId: checklistId,
    TargetCheckListIds: checklistIds,
    CopyMetaTable: copyMetaTable
  });  
}

/**
 * Get a list of attachments on a checklist
 * 
 * @param {Number} checklistId Checklist ID
 * 
 * @returns {Promise<Object>} Promise<Object>
 */
export const getAttachmentsForChecklist = (checklistId) => {
  return returnDataOnly(AxiosAuthenticated().get('/CheckList/Attachments', {
    params: {
      checkListId: checklistId,
      thumbnailSize: 0
    }
  }));
}

/**
 * Delete an attachment on a checklist
 * 
 * @param {Number} checklistId Checklist ID
 * @param {Number} attachmentId Attachment ID
 * 
 * @returns {Promise<Object>} Promise<Object>
 */
export const deleteChecklistAttachment = (checklistId,attachmentId) => {
  return AxiosAuthenticated().delete('/CheckList/Attachment', {
    data: {
      CheckListId: checklistId,
      AttachmentId: attachmentId
  }});
}

/**
 * Get information regarding a tag, including additional fields
 * 
 * @param {Number} tagId ID of Tag to get information about
 */
export const getTagInfo = (tagId) => {
  return returnDataOnly(AxiosAuthenticated().get('/Tag', {
    params: {
      tagId: tagId
    }
  }));
}

/**
 * Get punchlist for a PurchaseOrder with given calloff
 * @param {Number} purchaseOrderId PurchaseOrderId/CallOffId
 */
export const getPunchListForPurchaseOrder = (purchaseOrderId) => {
  return returnDataOnly(AxiosAuthenticated().get('/PurchaseOrder/PunchList', {
    params: {
      callOffId: purchaseOrderId
    }
  }))
}

/**
 * Get punchlist for a Tag with given TagID
 * @param {Number} tagId Tag ID
 */
export const getPunchListForTag = (tagId) => {
  return returnDataOnly(AxiosAuthenticated().get('/Tag/PunchList', {
    params: {
      tagId: tagId
    }
  }))
}

/**
 * Get punchlist for a MCPackage with given Package ID
 * @param {Number} mcPackageId MC Package ID
 */
export const getPunchListForMcPackage = (mcPackageId) => {
  return returnDataOnly(AxiosAuthenticated().get('/McPkg/PunchList', {
    params: {
      mcPkgId: mcPackageId
    }
  }))
}

/**
 * Get punchlist for WorkOrder
 * @param {Number} workOrderId WorkOrder ID
 */
export const getPunchListForWorkOrder = (workOrderId) => {
  return returnDataOnly(AxiosAuthenticated().get('/WorkOrder/PunchList', {
    params: {
      workOrderId: workOrderId
    }
  }))
}

/**
 * Get punchlist for Checklist
 * 
 * @param {Number} checklistId Checklist ID
 */
export const getPunchListForChecklist = (checklistId) => {
  return returnDataOnly(AxiosAuthenticated().get('/CheckList/PunchList', {
    params: {
      checkListId: checklistId
    }
  }));
}

/**
 * Get details for a punch item 
 * 
 * @param {Number} punchId Punch Item ID
 */
export const getPunchItemDetails = (punchId) => {
  return returnDataOnly(AxiosAuthenticated().get('/PunchListItem', {
    params: {
      punchItemId: punchId
    }
  }));
}

/**
 * Get all comments associated with a punch item. 
 * 
 * @param {number} punchId Punch Item ID
 */
export const getPunchItemComments = (punchId) => {
  return returnDataOnly(AxiosAuthenticated().get('/PunchListItem/Comments', {
    params: {
      punchItemId: punchId
    }
  }));
}

/**
 * Add a comment to Punch Item
 * 
 * @param {number} punchId Punch Item ID
 * @param {string} commentText Textstring to set as comment
 */
export const addPunchItemComment = (punchId, commentText) => {
  return AxiosAuthenticated().post('/PunchListItem/AddComment', {
    punchItemId: punchId,
    Text: commentText
  });
}

/**
 * Set Punch Item Priority
 * 
 * @param {Number} punchId Punch Item ID
 * @param {Number} priorityId Punch Priority ID
 */
export const setPunchItemPriority = (punchId, priorityId) => {
  return AxiosAuthenticated().put('/PunchListItem/SetPriority', {
    PunchItemId: punchId,
    PriorityId: priorityId
  });
}

/**
 * Set Category for given punch
 * 
 * @param {Number} punchId Punch Item ID
 * @param {Number} categoryId Category ID
 */
export const setPunchItemCategory = (punchId, categoryId) => {
  return AxiosAuthenticated().put('/PunchListItem/SetCategory', {
    PunchItemId: punchId,
    CategoryId: categoryId
  });
}

/**
 * Set Sorting for given punch
 * 
 * @param {Number} punchId Punch Item ID
 * @param {Number} sortingId Sorting ID
 */
export const setPunchItemSorting = (punchId, sortingId) => {
  return AxiosAuthenticated().put('/PunchListItem/SetSorting', {
    PunchItemId: punchId,
    SortingId: sortingId
  });
}

/**
 * Set Type for given punch
 * 
 * @param {Number} punchId Punch Item ID
 * @param {Number} typeId Type ID
 */
export const setPunchItemType = (punchId, typeId) => {
return AxiosAuthenticated().put('/PunchListItem/SetType', {
    PunchItemId: punchId,
    TypeId: typeId
  });
}

/**
 * Set DueDate for given punch
 * 
 * @param {number} punchId Punch Item ID
 * @param {string} dueDate DateTime in ISO Date format
 */
export const setPunchItemDueDate = (punchId, dueDate) => {
  return AxiosAuthenticated().put('/PunchListItem/SetDueDate', {
    PunchItemId: punchId,
    DueDate: dueDate
  });
}

/**
 * Set Raised By for given punch
 * 
 * @param {Number} punchId Punch Item ID
 * @param {Number} orgId Organization ID
 */
export const setPunchItemRaisedByOrg = (punchId, orgId) => {
  return AxiosAuthenticated().put('/PunchListItem/SetRaisedBy', {
    PunchItemId: punchId,
    RaisedByOrganizationId: orgId
  });
}

/**
 * Set ActionBy on Punch Item
 * 
 * @param {number} punchId Punch Item ID
 * @param {number} personId Person ID
 */
export const setPunchItemActionByPerson = (punchId, personId) => {
  return AxiosAuthenticated().put('/PunchListItem/SetActionByPerson', {
    PunchItemId: punchId,
    PersonId: personId
  });
}

/**
 * Set Clearing By for given punch
 * 
 * @param {Number} punchId Punch Item ID
 * @param {Number} orgId Organization ID
 */
export const setPunchItemClearingByOrg = (punchId, orgId) => {
  return AxiosAuthenticated().put('/PunchListItem/SetClearingBy', {
    PunchItemId: punchId,
    ClearingByOrganizationId: orgId
  });
}

/**
 * Set Description for given punch
 * 
 * @param {Number} punchId Punch Item ID
 * @param {String} newDescription Description text
 */
export const setPunchItemDescription = (punchId, newDescription) => {
  return AxiosAuthenticated().put('/PunchListItem/SetDescription', {
    PunchItemId: punchId,
    Description: newDescription
  });
}

/**
 * Set the estimate for Punch Item
 * 
 * @param {number} punchId Punch Item ID
 * @param {number} newEstimate Punch Item Estimate number
 */
export const setPunchItemEstimate = (punchId, newEstimate) => {
  return AxiosAuthenticated().put('/PunchListItem/SetEstimate', {
    PunchItemId: punchId,
    Estimate: newEstimate
  });
}

/**
 * Get all available punch item Categories
 */
export const getPunchItemCategories = () => {
  return returnDataOnly(AxiosAuthenticated().get('/PunchListItem/Categories'));
}

/**
 * Get all available punch item Organizations
 */
export const getPunchItemOrganizations = () => {
  return returnDataOnly(AxiosAuthenticated().get('/PunchListItem/Organizations'));
}

/**
 * Get all available punch item Sortings
 */
export const getPunchItemSortings = () => {
  return returnDataOnly(AxiosAuthenticated().get('/PunchListItem/Sorts'));
}

/**
 * Get all available punch item Types
 */
export const getPunchItemTypes = () => {
  return returnDataOnly(AxiosAuthenticated().get('/PunchListItem/Types'));
}

/**
 * Get all punch priorities
 * 
 */
export const getPunchPriorities = () => {
  return returnDataOnly(AxiosAuthenticated().get('/PunchListItem/Priorities'));
}

/**
 * Clear Punch Item
 * 
 * @param {Number} punchId Punch Item ID
 */
export const setPunchItemCleared = (punchId) => {
  return AxiosAuthenticated().post('/PunchListItem/Clear', JSON.stringify(punchId));
}

/**
 * Unclear Punch Item
 * 
 * @param {Number} punchId Punch Item ID
 */
export const setPunchItemUnclear = (punchId) => {
  return AxiosAuthenticated().post('/PunchListItem/Unclear', JSON.stringify(punchId));
}

/**
 * Reject Punch Item
 * 
 * @param {Number} punchId Punch Item ID
 */
export const setPunchItemRejected = (punchId) => {
  return AxiosAuthenticated().post('/PunchListItem/Reject', JSON.stringify(punchId));
}

/**
 * Verify Punch Item
 * 
 * @param {Number} punchId Punch Item ID
 */
export const setPunchItemVerified = (punchId) => {
  return AxiosAuthenticated().post('/PunchListItem/Verify', JSON.stringify(punchId));
}

/**
 * Unverify Punch Item
 * 
 * @param {Number} punchId Punch Item ID
 */
export const setPunchItemUnverified = (punchId) => {
  return AxiosAuthenticated().post('/PunchListItem/Unverify', JSON.stringify(punchId));
}

/**
 * Get all attachments for a punch
 * 
 * @param {Number} punchId Punch ID
 */
export const getAttachmentsForPunchItem = (punchId) => {
  return returnDataOnly(AxiosAuthenticated().get('/PunchListItem/Attachments', {
    params: {
      punchItemId: punchId,
      thumbnailSize: 0
    }
  }))
}

/**
 * Delete an attachment on a punch item
 * 
 * @param {Number} punchId Punch ID
 * @param {Number} attachmentId Attachment ID
 * 
 * @returns {Promise<Object>} Promise<Object>
 */
export const deletePunchItemAttachment = (punchId,attachmentId) => {
  return AxiosAuthenticated().delete('/PunchListItem/Attachment', {
    data: {
      PunchItemId: punchId,
      AttachmentId: attachmentId
  }});
}

/**
 * Create a new punch item
 * 
 * @param {Number} checklistId Checklist ID
 * @param {String} description Description
 * @param {Number} categoryId Category ID
 * @param {Number} typeId Type ID
 * @param {Number} sortingId Sorting ID
 * @param {Number} raisedByOrgId Organization ID
 * @param {Number} clearingByOrgId Organization ID
 * @param {Number} priorityId Priority ID
 * @param {Number} estimate Estimate number
 * @param {Number} dueDate Datetime ISO string
 * @param {Array} tempAttachmentList List of IDs of temporary attachments
 */
export const createPunchItem = (checklistId, description, categoryId, typeId, sortingId, raisedByOrgId, clearingByOrgId, priorityId,estimate, dueDate, actionByPersonId, tempAttachmentList = []) => {
  return AxiosAuthenticated().post('/PunchListItem', {
    CheckListId: checklistId,
    Description: description,
    CategoryId: categoryId,
    TypeId: typeId,
    SortingId: sortingId,
    RaisedByOrganizationId: raisedByOrgId,
    ClearingByOrganizationId: clearingByOrgId,
    TemporaryFileIds: tempAttachmentList,
    PriorityId: priorityId,
    Estimate: estimate,
    DueDate: dueDate,
    ActionByPerson: actionByPersonId
  });
}

/**
 * Connect a punch item to a work order
 * 
 * @param {Number} punchItemId Punch Item ID
 * @param {Number} workorderId WorkOrder ID
 */
export const setWorkOrderForPunchItem = (punchItemId, workorderId) => {
  return AxiosAuthenticated().put('/PunchListItem/SetWorkOrder', {
    PunchItemId: punchItemId,
    WorkOrderId: workorderId
  });
}

/**
 * Check if a checklist (MCCR) exists in a WorkOrder.
 * 
 * @param {Number} checklistId Checklist ID
 * 
 * @returns {Promise<Number>} WorkOrder ID
 */
export const getWorkOrderForChecklist = (checklistId) => {
  return returnDataOnly(AxiosAuthenticated().get('/WorkOrderCheckList', {
    params: {
      checkListId: checklistId
    }
  }));
}

/**
 * Get a list of all saved *MC app* searches in ProCoSys 
 */
export const getSavedSearchesList = () => {
  return returnDataOnly(AxiosAuthenticated().get('/SavedSearches'));
}

export const deleteSavedSearch = (savedSearchId) => {
  return AxiosAuthenticated().delete('/Search', {
    params: {
      savedSearchId
    }
  });
};

/**
 * Get Punch items returned from a pre-defined saved search
 * 
 * @param {Number} savedSearchId Saved Search ID
 * @param {Number} page Which pagination page to fetch
 * @param {Number} numberOfItems Number of items to get
 */
export const getPunchItemsForSavedSearch = (savedSearchId, page = 0, numberOfItems = 30) => {
  return returnDataOnly(AxiosAuthenticated().get('/PunchListItem/Search', {
    params: {
      savedSearchId: savedSearchId,
      currentPage: page,
      itemsPerPage: numberOfItems
    }
  }))
}

/**
 * Get Checklists returned from a pre-defined saved search
 * 
 * @param {Number} savedSearchId Saved Search ID
 * @param {Number} page Which pagination page to fetch
 * @param {Number} numberOfItems Number of items to get
 */
export const getChecklistsForSavedSearch = (savedSearchId, page = 0, numberOfItems = 30) => {
  return returnDataOnly(AxiosAuthenticated().get('/CheckList/Search', {
    params: {
      savedSearchId: savedSearchId,
      currentPage: page, 
      itemsPerPage: numberOfItems
    }
  }))
}

/**
 * Search for persons in ProCoSys
 * 
 * @param {string} name Firstname/Lastname/Username
 * @param {number} numberOfRows Number of rows to return, defaults to 10.
 */
export const getPersonsByName = (name, numberOfRows = 10) => {
  return returnDataOnly(AxiosAuthenticated().get('/Person/PersonSearch', {
    params: {
      searchString: name,
      numberOfRows: numberOfRows
    }
  }));
}



export default {
  getPlants,
  getProjects,
  setPlant,
  setProject,
  getSupportedApiVersions,
  searchForMcPackage,
  searchForWo,
  searchForTag,
  searchForPo,
  // Checklist
  getChecklistsForWorkOrder,
  getChecklistsForPurchaseOrder,
  getChecklistsForMcPackage,
  getChecklistsForTag,
  getChecklistDetailsForChecklist,
  setCheckItemStatus,
  addCustomCheckItem,
  deleteCustomCheckItem,
  signChecklist,
  unsignChecklist,
  verifyChecklist,
  unverifyChecklist,
  canMultiSignChecklist,
  canMultiVerifyChecklist,
  multiSignChecklist,
  multiVerifyChecklist,
  getAttachmentsForChecklist,
  deleteChecklistAttachment,
  getTagInfo,
  setChecklistComment,
  //Preservation Checklist
  getChecklistDetailsForPreservationChecklist,
  signPreservationChecklist,
  unsignPreservationChecklist,
  verifyPreservationChecklist,
  unverifyPreservationChecklist,

  // Punch List
  getPunchListForPurchaseOrder,
  getPunchListForTag,
  getPunchListForMcPackage,
  getPunchListForWorkOrder,
  getPunchListForChecklist,
  updateMetatableValueForChecklist,
  // Punch Items
  getPunchItemDetails,
  getPunchItemComments,
  getPunchItemCategories,
  getPunchItemOrganizations,
  getPunchItemSortings,
  getPunchItemTypes,
  getPunchPriorities,
  setPunchItemPriority,
  setPunchItemEstimate,
  setPunchItemDescription,
  setPunchItemClearingByOrg,
  setPunchItemRaisedByOrg,
  setPunchItemActionByPerson,
  setPunchItemType,
  setPunchItemDueDate,
  setPunchItemSorting,
  setPunchItemCategory,
  setPunchItemUnverified,
  setPunchItemVerified,
  setPunchItemRejected,
  setPunchItemUnclear,
  setPunchItemCleared,
  getAttachmentsForPunchItem,
  deletePunchItemAttachment,
  createPunchItem,
  addPunchItemComment,
  getWorkOrderForChecklist,
  setWorkOrderForPunchItem,
  // Saved search
  getSavedSearchesList,
  getChecklistsForSavedSearch,
  getPunchItemsForSavedSearch,
  deleteSavedSearch,
  // Person
  getPersonsByName
};
