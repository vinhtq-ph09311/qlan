package com.viettel.qlan.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


import com.viettel.qlan.dto.AreaDTO;

public interface AreaService {
	// path ben file app.rest.endpoint.js cua Area la: AREA_URL : "areaServiceRest/area",
	
	@POST
	@Path("/doSearch")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response doSearch(AreaDTO areaDTO);
	
	@POST
	@Path("/area/getTree")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response getTree();
	
	@POST
	@Path("/doSearchChildren")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response doSearchChildren(AreaDTO areaDTO);
	
	
	@POST
	@Path("/area/getAreaById")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response getAreaById(Long id);
	
	@POST
	@Path("/area/getListAreaAutoSearch")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response getListAreaAutoSearch(AreaDTO obj);
	
	@POST
	@Path("/area/addArea")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response addArea(AreaDTO obj);
	
	@POST
	@Path("/area/remove")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response remove(AreaDTO obj);
	
	@POST
	@Path("/area/updateArea")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response updateArea(AreaDTO obj);
	

	
}
