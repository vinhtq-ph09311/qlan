package com.viettel.qlan.rest;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.viettel.qlan.dto.UserAlertsDTO;

public interface UserAlertsService {

	@POST
	@Path("/userAlert/doSearch")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Response doSearch(UserAlertsDTO obj);
	
	@POST
    @Path("/userAlert/update")
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Response update(UserAlertsDTO obj) throws Exception;
	
	@POST
	@Path("/userAlert/getListWLAutoSearch")
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Response getListWarningLevel();
	
	@POST
	@Path("/userAlert/add")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response addUserAlert(UserAlertsDTO obj) throws Exception;
	
	@POST
	@Path("/userAlert/remove")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response deleteUserAlert(UserAlertsDTO obj) throws Exception;
	
	@POST
	@Path("/userAlert/removeAll")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
	public Response deleteUserAlerts(List<UserAlertsDTO> listUserAlert) throws Exception;
}
