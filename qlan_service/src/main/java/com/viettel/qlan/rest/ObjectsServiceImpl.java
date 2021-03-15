package com.viettel.qlan.rest;

import java.util.Collections;
import java.util.List;

import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;

import com.viettel.qlan.business.ObjectBusinessImpl;
import com.viettel.qlan.dto.ObjectsDTO;
import com.viettel.service.base.dto.DataListDTO;

public class ObjectsServiceImpl implements ObjectsService {

	@Autowired
	ObjectBusinessImpl objectBusinessImpl;

	@Override
	public Response getListObjects(ObjectsDTO objectsDTO) {
		DataListDTO data = objectBusinessImpl.getListObjects(objectsDTO);
		return Response.ok(data).build();
	}

	@Override
	public Response getParent() {
		// TODO Auto-generated method stub
		return Response.ok(objectBusinessImpl.getParent()).build();
	}

	@Override
	public Response remove(ObjectsDTO obj) {
		// TODO Auto-generated method stub
		if (obj != null) {
			try {
				return Response.ok(objectBusinessImpl.removeObject(obj)).build();
			} catch (Exception e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();

			}
		}
		return Response.status(Response.Status.BAD_REQUEST).build();
	}

	@Override
	public void lock(List<ObjectsDTO> listObject) {

		try {
		objectBusinessImpl.lock(listObject);
		} catch (Exception e) {
		 Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();

		}
	}

	@Override
	public void unlock(List<ObjectsDTO> listObject) {

		objectBusinessImpl.unlock(listObject);

	}

	@Override
	public Response add(ObjectsDTO obj) throws Exception {
		// TODO Auto-generated method stub
		try {
			return Response.ok(objectBusinessImpl.addObject(obj)).build();
		} catch (Exception e) {
			// TODO: handle exception
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

	@Override
	public Response update(ObjectsDTO obj) throws Exception {
		try {
			return Response.ok(objectBusinessImpl.updateObject(obj)).build();
		} catch (Exception e) {
			return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
		}
	}

}
