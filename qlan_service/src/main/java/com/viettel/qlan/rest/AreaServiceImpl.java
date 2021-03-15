package com.viettel.qlan.rest;

import java.util.Collections;


import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;

import com.viettel.base.common.BusinessException;
import com.viettel.qlan.business.AreaBusinessImpl;
import com.viettel.qlan.dto.AreaDTO;
import com.viettel.service.base.dto.DataListDTO;

public class AreaServiceImpl extends AbstractRsService implements AreaService {
	
//	AbstractRsService - thực hiện kiểm tra user ==> trả về  request là userName (Tên user)
	
	

	@Autowired
	AreaBusinessImpl areaBusinessImpl;

	@Override
	public Response doSearch(AreaDTO areaDTO) {
		DataListDTO dataListDTO = areaBusinessImpl.doSearch(areaDTO);
		return Response.ok(dataListDTO).build();
	}

	@Override
	public Response getTree() {
		return Response.ok(areaBusinessImpl.getTree()).build();
	}

	@Override
	public Response doSearchChildren(AreaDTO areaDTO) {
		DataListDTO dataListDTO = areaBusinessImpl.doSearchChildren(areaDTO);
		return Response.ok(dataListDTO).build();
	}

	@Override
	public Response getAreaById(Long id) {
		return Response.ok(areaBusinessImpl.getAreaById(id)).build();
	}

	@Override
	public Response getListAreaAutoSearch(AreaDTO obj) {
		return Response.ok(areaBusinessImpl.getListAreaAutoSearch(obj)).build();
	}

	@Override
	public Response addArea(AreaDTO obj) {
		
		if (obj != null) {
			try {

				return Response.ok(areaBusinessImpl.addArea(obj, request)).build();
			} catch (BusinessException e) {
				// trả ra lỗi: result.error bên AngularJS
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();

			}
		} else {
			// server không xử lý hoặc không thể xử lý
			return Response.status(Response.Status.BAD_REQUEST).build();
		}
	}

	@Override
	public Response remove(AreaDTO obj) {
		if (obj != null) {
			try {
				return Response.ok(areaBusinessImpl.removeArea(obj,request)).build();
			} catch (Exception e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();

			}
		}
		return Response.status(Response.Status.BAD_REQUEST).build();
	}

	@Override
	public Response updateArea(AreaDTO obj) {
		if (obj != null) {
			try {
				return Response.ok(areaBusinessImpl.updateArea(obj,request)).build();
			} catch (Exception e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();

			}
		}
		return Response.status(Response.Status.BAD_REQUEST).build();
	}

}
