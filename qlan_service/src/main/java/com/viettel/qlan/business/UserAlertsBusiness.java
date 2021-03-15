package com.viettel.qlan.business;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.viettel.qlan.dto.ApParamDTO;
import com.viettel.qlan.dto.UserAlertsDTO;

public interface UserAlertsBusiness {
	
	List<ApParamDTO> getListWarningLevel();
	
	public Long addUserAlert(UserAlertsDTO obj, HttpServletRequest request) throws Exception;
	
	public Long updateUserAlert(UserAlertsDTO obj, HttpServletRequest request) throws Exception;
	
	public Long deleteUserAlert(UserAlertsDTO obj, HttpServletRequest request) throws Exception;
	
	public void deleteListUserAlert(List<UserAlertsDTO> listUserAlerts, HttpServletRequest request) throws Exception; 
	
	
}
