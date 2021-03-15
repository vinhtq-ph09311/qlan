package com.viettel.qlan.rest;

import java.util.Collections;
import java.util.List;

import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;

import com.viettel.base.common.BusinessException;
import com.viettel.qlan.business.UserAlertsBusinessImpl;
import com.viettel.qlan.dto.ApParamDTO;
import com.viettel.qlan.dto.UserAlertsDTO;
import com.viettel.service.base.dto.DataListDTO;

public class UserAlertsServiceImpl extends AbstractRsService implements UserAlertsService {

	@Autowired
	UserAlertsBusinessImpl userAlertsBusinessImpl;

	@Override
	public Response doSearch(UserAlertsDTO obj) {
		DataListDTO data = userAlertsBusinessImpl.doSearch(obj);
		return Response.ok(data).build();
	}

	@Override
	public Response update(UserAlertsDTO obj) throws Exception {
		if (obj != null) {
			try {
				return Response.ok(userAlertsBusinessImpl.updateUserAlert(obj, request)).build();
			} catch (BusinessException e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();

			}
		}
		return Response.status(Response.Status.BAD_REQUEST).build();
	}

	@Override
	public Response getListWarningLevel() {
		List<ApParamDTO> listDTO= userAlertsBusinessImpl.getListWarningLevel();
		for(ApParamDTO dto : listDTO) {
			System.out.println(dto.getName());
		}
		return  Response.ok(listDTO).build();
	}

	@Override
	public Response addUserAlert(UserAlertsDTO obj) throws Exception {
		if (obj != null) {
			try {
				return Response.ok(userAlertsBusinessImpl.addUserAlert(obj, request)).build();
			} catch (BusinessException e) {

				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();

			}
		} else {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}
	}

	@Override
	public Response deleteUserAlert(UserAlertsDTO obj) throws Exception {
		if (obj != null) {
			try {
				Long id = userAlertsBusinessImpl.deleteUserAlert(obj, request);

				return Response.ok(id).build();
			} catch (BusinessException e) {
				
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
			}
		} else {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}
	}

	@Override
	public Response deleteUserAlerts(List<UserAlertsDTO> listUserAlert) throws Exception {
		if(listUserAlert != null) {
			try {
				userAlertsBusinessImpl.deleteListUserAlert(listUserAlert, request);
				return Response.ok().build();
			} catch (BusinessException e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
			}
		} else {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}
		
	}

}
