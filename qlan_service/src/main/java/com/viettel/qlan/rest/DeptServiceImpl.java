
package com.viettel.qlan.rest;

import java.util.Collections;
import java.util.List;

import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;

import com.viettel.base.common.BusinessException;
import com.viettel.qlan.business.DeptBusinessImpl;
import com.viettel.qlan.dto.DeptDTO;
import com.viettel.service.base.dto.DataListDTO;

public class DeptServiceImpl extends AbstractRsService implements DeptService {

	@Autowired
	DeptBusinessImpl deptBusinessImpl;
	
	@Override
	public Response doSearch(DeptDTO obj) {
		DataListDTO data= deptBusinessImpl.doSearch(obj);
		return Response.ok(deptBusinessImpl.doSearch(obj)).build();
	}

	@Override
	public Response getTree() {
		return Response.ok(deptBusinessImpl.getTree()).build();
	}

	@Override
	public Response doSearchChildren(DeptDTO obj) {
		DataListDTO data = deptBusinessImpl.doSearchChildren(obj);
		return Response.ok(data).build();
	}

	@Override
	public Response getDeptById(Long id) {
		return Response.ok(deptBusinessImpl.getDeptById(id)).build();
	}

	@Override
	public Response getListDept(DeptDTO obj) throws Exception {
		List<DeptDTO> listDTO= deptBusinessImpl.getListDept(obj);
		return Response.ok(listDTO).build();
	}

	@Override
	public Response add(DeptDTO obj) throws Exception {
		if(obj != null) {
			
			try {
				return Response.ok(deptBusinessImpl.add(obj)).build();
			} catch (BusinessException e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
			}
			
		}else {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}
	}

	@Override
	public Response update(DeptDTO obj) throws Exception {
		if(obj != null) {
			
			try {
				return Response.ok(deptBusinessImpl.update(obj)).build();
			} catch (BusinessException e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
			}
			
		}else {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}
	}

	@Override
	public Response delete(DeptDTO obj) throws Exception {
		if (obj != null) {
			try {
				Long id = deptBusinessImpl.remove(obj);

				return Response.ok(id).build();
			} catch (BusinessException e) {
				return Response.ok().entity(Collections.singletonMap("error", e.getMessage())).build();
			}
		} else {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}
	}
	
}












































