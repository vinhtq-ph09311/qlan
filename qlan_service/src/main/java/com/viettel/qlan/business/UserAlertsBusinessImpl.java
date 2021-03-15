package com.viettel.qlan.business;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import com.viettel.base.common.BusinessException;
import com.viettel.qlan.bo.UserAlerts;
import com.viettel.qlan.dao.ApParamDAO;
import com.viettel.qlan.dao.DeptDAO;
import com.viettel.qlan.dao.UserAlertsDAO;
import com.viettel.qlan.dto.ApParamDTO;
import com.viettel.qlan.dto.UserAlertsDTO;
import com.viettel.qlan.utils.QlanResource;
import com.viettel.qlan.utils.ValidateUAlert;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;

@Service("userAlertsBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class UserAlertsBusinessImpl extends BaseFWBusinessImpl<UserAlertsDAO, UserAlertsDTO, UserAlerts>
		implements UserAlertsBusiness {
	private static String TABLE_NAME = "USERT_ALERTS";
	private static String DISPLAY_NAME_KEY = "mng_user_alert";
	
	@Autowired
	private UserAlertsDAO userAlertsDAO;

	@Autowired
	private ApParamDAO apParamDAO;

	@Autowired
	ActionAuditBusinessImpl actionAuditBusinessImpl;
	
	@Autowired
	private DeptDAO deptDAO;

	public DataListDTO doSearch(UserAlertsDTO obj) {
		List<UserAlertsDTO> ls = userAlertsDAO.doSearch(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getTotalRecord());
		data.setStart(1);
		return data;
	}

	// Combobox Cảnh báo
	@Override
	public List<ApParamDTO> getListWarningLevel() {
		List<ApParamDTO> list = apParamDAO.getListWaning();
		return list;
	}

	// Thêm mới UserAlert
	@Override
	public Long addUserAlert(UserAlertsDTO obj, HttpServletRequest request) throws Exception {
	
		if(ValidateUserAlert(obj) != null && ValidateUserAlert(obj).length() > 0) {
			throw new BusinessException(ValidateUserAlert(obj));
		}
		
		if(obj != null) {
				Long userAlertId = userAlertsDAO.addUserAlert(obj);
				return userAlertId;
		}else {
			throw new BusinessException(QlanResource.get("create_error_user_alert"));
		}
		
	}
	
	@Override
	public Long updateUserAlert(UserAlertsDTO obj, HttpServletRequest request) throws Exception {
		
		if(ValidateUserAlert(obj) != null && ValidateUserAlert(obj).length() > 0) {
			throw new BusinessException(ValidateUserAlert(obj));
		}
		
		if(obj.getStaffId() != null) {
				Long userAlertId = userAlertsDAO.updateUserAlert(obj);
				return userAlertId;
		}else {
			throw new BusinessException(QlanResource.get("update_error_user_alert"));
		}
		
	}

	@Override
	public Long deleteUserAlert(UserAlertsDTO obj, HttpServletRequest request) throws Exception {
		return this.deleteU(obj);
	}

	@Override
	public void deleteListUserAlert(List<UserAlertsDTO> listUserAlerts, HttpServletRequest request) throws Exception {
		if(listUserAlerts.size() <= 999) {
			for(UserAlertsDTO obj : listUserAlerts) {
				this.deleteU(obj);
			}
		}else {
			throw new BusinessException(QlanResource.get("delete_error_max"));
		}
		
	}
	
	public Long deleteU(UserAlertsDTO obj) throws Exception {
		if(obj.getStaffId() != null) {
			if (userAlertsDAO.getById(obj.getStaffId()) == null) {
				throw new BusinessException(QlanResource.get("exist_user_alert_of_Id"));
			}else {
				Long userAlertId = userAlertsDAO.removeUserAlert(obj);
				return userAlertId;
			}
		}else {
			throw new BusinessException(QlanResource.get("delete_error_user_alert"));
		}
	}
	
	public String ValidateUserAlert(UserAlertsDTO obj) {
		String errorStaffCode = "";
		String errorName= "";
		String errorEmail= "";
		String errorTel= "";
		String errorWarningLevel = "";
		String errorStatus = "";
		String errorDeptId ="";
		
		
		if (ValidateStaffCode(obj) != null) {
			errorStaffCode = QlanResource.get(ValidateStaffCode(obj)) + " </br>";
		}
		if (ValidateName(obj) != null) {
			errorName = QlanResource.get(ValidateName(obj)) + " </br>";
		}
		if (ValidateEmail(obj) != null) {
			errorEmail = QlanResource.get(ValidateEmail(obj)) + " </br>";
		}
		if (ValidateTel(obj) != null) {
			errorTel = QlanResource.get(ValidateTel(obj)) + " </br>";
		}
		if (ValidateStatus(obj) != null) {
			errorStatus = QlanResource.get(ValidateStatus(obj)) + " </br>";
		}
		if (ValidateDeptId(obj) != null) {
			errorDeptId = QlanResource.get(ValidateDeptId(obj)) + " </br>";
		}
		if (ValidateWarningLevel(obj) != null) {
			errorWarningLevel = QlanResource.get(ValidateWarningLevel(obj)) + " </br>";
		}
		
		String error = errorStaffCode + errorName + errorEmail + errorTel + errorDeptId + errorWarningLevel + errorStatus ;
		
		return error;
		
		
	}
	
	public String ValidateStaffCode(UserAlertsDTO obj) {
		// obj.getStaffId() -> Kiểm tra hành động Update hoặc Create
		if(obj.getStaffId() != null ) {
			if(userAlertsDAO.getById(obj.getStaffId()) == null) {
				return "dublicate_user_alert_not_user_alert";
			}
		}
		if (ValidateUAlert.Ischecknull(obj.getStaffCode())) {
			return "exist_staffcode_null";
		}
		if (ValidateUAlert.htmlCheck(obj.getStaffCode())) {
			return "exist_user_alert_not_Html_StaffCode";
		}
		if (ValidateUAlert.IscheckspecialCharacter(obj.getStaffCode())) {
			return "exist_user_alert_not_Character";
		}
		if (obj.getStaffCode().length() > 100) {
			return "exist_user_alert_not_maxlength_StaffCode";
		}
		if (ValidateUAlert.IsCheckspecialCharacterCode(obj.getStaffCode())) {
			return "exist_user_alert_not_Character_StaffCode";
		}
		if (ValidateUAlert.hasWhiteSpace(obj.getStaffCode())) {
			return "exist_detpt_not_Space_Code";
		}
		
		if (obj.getStaffId() == null ) {
			if (userAlertsDAO.checkDuplicateStaffCode2(obj.getStaffCode()) != null) {
				return "staff_code_exits";
			}
		} 
		// Kiểm tra StaffCode khi cập nhật
		if(obj.getStaffId() != null ) {
			UserAlertsDTO dto = userAlertsDAO.checkDuplicateStaffCode2(obj.getStaffCode());
			if(dto != null) {
				if(!dto.getStaffId().equals(obj.getStaffId())) {
					return "staff_code_exits";
				}
			}
		}
		return null;
		
	}
	// OK
	public String ValidateName(UserAlertsDTO obj) {
		if (ValidateUAlert.Ischecknull(obj.getName())) {
			return "exist_user_alert_name_null";
		}
		if (ValidateUAlert.htmlCheck(obj.getName())) {
			return "exist_user_alert_not_Html_name";
		}

		if (ValidateUAlert.IscheckspecialCharacter(obj.getName())) {
			return "exist_user_alert_not_Character_name";
		}

		if (obj.getName().length() > 100) {
			return "exist_user_alert_not_maxlength_name";
		}
		return null;
	}
	// OK
	public String ValidateStatus(UserAlertsDTO obj) {
		if (obj.getStatus() == null) {
			return "exist_userAlertStatus_null";
		}
		return null;
	}
	public String ValidateEmail(UserAlertsDTO obj) {
		if(ValidateUAlert.Ischecknull(obj.getTel())) {
			return "exist_userAlert_email_null";
		}
		if(!ValidateUAlert.emailCheck(obj.getEmail())) {
			return "exist_userAlert_email";
		}
		return null;
	}
	public String ValidateTel(UserAlertsDTO obj) {
		if(ValidateUAlert.Ischecknull(obj.getTel())) {
			return "exist_userAlert_tel_null";
		}
		if(!ValidateUAlert.telCheck(obj.getTel())) {
			return "exist_userAlert_tel";
		}
		return null;
	}
	public String ValidateDeptId(UserAlertsDTO obj) {
		if(obj.getDeptId() == null) {
			return "exist_userAlert_deptId_null";
		}
		if(obj.getDeptId() != null && deptDAO.getDeptById(obj.getDeptId()) == null){
			return "dublicate_detpt_not_Dept";
		}
		return null;
	}
	public String ValidateWarningLevel(UserAlertsDTO obj) {
		if(obj.getWarningLevel() == null) {
			return "exist_userAlert_warning_null";
		}
		if(obj.getWarningLevel() != null && apParamDAO.getWLByValue(obj.getWarningLevel()) == null){
			return "dublicate_userAlert_not_warning";
		}
		return null;
	}
	


	

}
;