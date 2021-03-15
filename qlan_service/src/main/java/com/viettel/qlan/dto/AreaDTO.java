package com.viettel.qlan.dto;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.viettel.qlan.bo.Area;

/**
 * @generated automatic by GenDTO.groovy
 * @Author: HaVD
 */

@XmlRootElement(name = "AREABO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AreaDTO extends QlanBaseDTO<Area> {

	private Long id;

	private Long parentId;

	private String areaCode;

	private String areaName;

	private Long status;

	private String path;

	private String parentName;

	private List<AreaDTO> lstList;
	
	private List<String> listId;
	
	

	public List<String> getListId() {
		return listId;
	}

	public void setListId(List<String> listId) {
		this.listId = listId;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public String getAreaCode() {
		return areaCode;
	}

	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}

	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	public Long getStatus() {
		return status;
	}

	public void setStatus(Long status) {
		this.status = status;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	@Override
	public String toString() {
		return "area{" + "id :" + id + "," + "parentId :" + parentId + "," + "areaCode :" + areaCode + ","
				+ "areaName :" + areaName + "," + "status :" + status + "," + "path :" + path + "," + "}";
	}

	@Override
	public String catchName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getParentName() {
		return parentName;
	}

	public void setParentName(String parentName) {
		this.parentName = parentName;
	}

	public List<AreaDTO> getLstList() {
		return lstList;
	}

	public void setLstList(List<AreaDTO> lstList) {
		this.lstList = lstList;
	}

	@Override
	public Area toModel() {
		Area area = new Area();
		area.setId(this.id);
		area.setAreaCode(this.areaCode);
		area.setAreaName(this.areaName);
		area.setParentId(this.parentId);
		area.setPath(this.path);
		area.setStatus(this.status);
		return area;
	}

}
