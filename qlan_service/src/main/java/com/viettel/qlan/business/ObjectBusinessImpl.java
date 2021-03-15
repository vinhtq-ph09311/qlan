package com.viettel.qlan.business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.viettel.base.common.BusinessException;
import com.viettel.qlan.bo.Objects;
import com.viettel.qlan.dao.ObjectsDAO;
import com.viettel.qlan.dto.ObjectsDTO;
import com.viettel.qlan.utils.QlanResource;
import com.viettel.qlan.utils.ValidateObject;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;

@Service("ObjectBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ObjectBusinessImpl extends BaseFWBusinessImpl<ObjectsDAO, ObjectsDTO, Objects> implements ObjectBusiness {
	
	private static String TABLE_NAME = "OBJECTS";
	private static String DISPLAY_NAME_KEY = "mng_object_name";
	
	@Autowired
	private ObjectsDAO objectsDAO;
	
	//// dua du lieu len bang vao tim kiem
	public DataListDTO getListObjects(ObjectsDTO objectsDTO) {
		List<ObjectsDTO> ls = objectsDAO.getAllObjects(objectsDTO);
		DataListDTO dataListDTO = new DataListDTO();
		dataListDTO.setData(ls);
		dataListDTO.setSize(objectsDTO.getTotalRecord());
		dataListDTO.setTotal(objectsDTO.getTotalRecord());
		dataListDTO.setStart(1);
		return dataListDTO;
	}

	//// load chuc nang cha
	public List<ObjectsDTO> getParent() {
		List<ObjectsDTO> ls = objectsDAO.getParent();
		return ls;
	}

	//// xoa chuc nang
	public String removeObject(ObjectsDTO obj) {
		if (obj != null) {
			///// check id cua chuc nang "quan ly chuc nang"
			if (obj.getObjectId() == 200L) {
				throw new BusinessException("Xóa không thành công, không thể xóa quản lý chức năng !");

			} else {
				if (obj.getObjectId() != null) {
					if (objectsDAO.isCheckDelObject(obj.getObjectId())) {
						throw new BusinessException(
								"Xóa không thành công, chức năng vẫn đang được gán cho nhóm quyền !");
					} else {
						String id = objectsDAO.removeObject(obj);

						return id;
					}
				}
			}
			return null;

		} else {
			throw new BusinessException("Không thể xóa");
		}
	}

	///khoa chuc nang
	@Transactional
	public void lock(List<ObjectsDTO> listObject) {
		for (ObjectsDTO obj : listObject) {
			if (obj.getObjectId().equals(200L)) {
				throw new BusinessException("Không thể khóa quản lý chức năng !");
			} else {
				ObjectsDTO objOld = objectsDAO.getObjectInfo(obj.getObjectId());
				if (objOld == null) {
					throw new BusinessException("Lỗi");
				} else {
					objectsDAO.LockObject(obj.getObjectId());
				}
			}
		}
	}
	
	///mo khoa chuc nang
	@Transactional
	public void unlock(List<ObjectsDTO> listObject) {
		for (ObjectsDTO obj : listObject) {
			ObjectsDTO objOld = objectsDAO.getObjectInfo(obj.getObjectId());
			if (objOld == null) {
				throw new BusinessException("Lỗi");
			} else {
				objectsDAO.unlockObject(obj.getObjectId());
			}

		}
	}
	
	/// them moi chuc nang
	public String addObject(ObjectsDTO obj) {
		if (ValidateObject(obj) != null && ValidateObject(obj).length() > 0) {
			throw new BusinessException(ValidateObject(obj));
		}
		
		if (obj != null) {
			if (objectsDAO.isCheckAddObject(obj.getObjectCode(), null)) {
				throw new BusinessException("Mã chức năng đã tồn tại !");
			} else {
				String id = objectsDAO.addObject(obj);
				return id;
			}
		} else {
			throw new BusinessException("Lỗi");
		}

	}
	
	//// cap nhat chuc nang
	public long updateObject(ObjectsDTO obj) {
		
		if (ValidateObject(obj) != null && ValidateObject(obj).length() > 0) {
			throw new BusinessException(ValidateObject(obj));
		}
		
		if (obj != null) {
			/// check id da ton tai hay chua 
			if (objectsDAO.isCheckAddObject(obj.getObjectCode(), obj.getObjectId())) {
				throw new BusinessException("Mã chức năng đã tồn tại !");
			} else {
				/// check id cua chuc nang "quan ly chuc nang"
				if (obj.getObjectId().equals(200L) && obj.getStatus() == 0L) {
					throw new BusinessException("không được để trạng thại không hoạt động !");
				} else {
					long id = objectsDAO.updateObject(obj);
					return id;
				}
			}

		} else {
			throw new BusinessException("Lỗi");
		}
	}
	///validate common
	public String ValidateObject(ObjectsDTO obj) {
		String errorObjectCode = "";
		String errorObjectName = "";
		String errorObjectUrl  = "";
		String errorObjectType = "";
		String errordescription = "";
		String errorstatus = "";
		
		if (ValidateObjectCode(obj) != null) {
			errorObjectCode = QlanResource.get(ValidateObjectCode(obj))+ "</br>";
		}
		
		if (ValidateObjectName(obj) !=null) {
			errorObjectName = QlanResource.get(ValidateObjectName(obj)) + "</br>";
		}
		
		if (ValidateObjectUrl(obj) != null) {
			errorObjectUrl = QlanResource.get(ValidateObjectUrl(obj)) + "</br>";
		}
		
		if (ValidateObjectType(obj) != null) {
			errorObjectType = QlanResource.get(ValidateObjectType(obj)) + "</br>" ;
		}
		
		if (Validatedescription(obj) != null) {
			errordescription  = QlanResource.get(Validatedescription(obj)) + "</br>";
		}
		
		if (Validatestatus(obj) != null) {
			errorstatus = QlanResource.get(Validatestatus(obj)) + "</br>";
		}
		
		String error = errorObjectCode + errorObjectName + errorObjectUrl + errorObjectType + errordescription + errorstatus;
		return error;
	}
	
	///validate objectCode
	public String ValidateObjectCode(ObjectsDTO obj) {
		
		if (ValidateObject.Ischecknull(obj.getObjectCode())) {
			return "exist_objectCode_not_null";
		}
		
		if (ValidateObject.IscheckspecialCharacter(obj.getObjectCode())) {
			return "exist_objectCode_not_Character";
		}
		
		if (ValidateObject.htmlCheck(obj.getObjectCode())) {
			return "exist_objectCode_not_HtmlCode";
		}
		
		if (ValidateObject.IsCheckspecialCharacterCode(obj.getObjectCode())) {
			return "exist_objectCode_not_CharacterCode";
		}
		
		if (obj.getObjectCode().length() > 100) {
			return "exist_objectCode_not_maxlength";
		}
		
		return null;
	}
	
	//// validate objectName
	public String ValidateObjectName(ObjectsDTO obj) {
		if (ValidateObject.Ischecknull(obj.getObjectName())) {
			return "exist_objectName_not_null";
		}
		
		if (ValidateObject.IscheckspecialCharacter(obj.getObjectName())) {
			return "exist_objectName_not_Character";
		}
		
		if (ValidateObject.htmlCheck(obj.getObjectName())) {
			return "exist_objectName_not_HtmlCode";
		}
		
		if (obj.getObjectName().length() > 200) {
			return "exist_objectName_not_maxlength";
		}
		
		
		return null;
	}
	
	/// validate objectUrl
	public String ValidateObjectUrl(ObjectsDTO obj) {
		if (ValidateObject.Ischecknull(obj.getObjectUrl())) {
			return "exist_objectUrl_not_null";
		}
		
		if (ValidateObject.hasWhiteSpace(obj.getObjectUrl())) {
			return "exist_objectUrl_not_has_white_space";
		}
		
		if (ValidateObject.IsCheckspecialCharacterCode(obj.getObjectUrl())) {
			return "exist_objectUrl_not_CharacterCode";
		}
		
		if (ValidateObject.htmlCheck(obj.getObjectUrl())) {
			return "exist_objectUrl_not_HtmlCode";
		}
		
		if (obj.getObjectUrl().length() > 100) {
			return "exist_objectUrl_not_maxlength";
		}
		
		return null;
	}
	
	///validate objectType
	public String ValidateObjectType(ObjectsDTO obj) {
		if (obj.getObjectTypeId() == null) {
			return "exist_objectType_not_null";
		}
		
		return null;
	}
	
	///validate description
	public String Validatedescription(ObjectsDTO obj) {
		if (ValidateObject.Ischecknull(obj.getDescription())) {
			return "exist_description_not_null";
		}
		
		if (ValidateObject.IscheckspecialCharacter(obj.getDescription())) {
			return "exist_description_not_Character";
		}
		
		if (ValidateObject.htmlCheck(obj.getDescription())) {
			return "exist_description_not_HtmlCode";
		}
		
		if (obj.getDescription().length() >1000) {
			return "exist_description_not_maxlength";
		}
		return null;
	}
	
	///validate status
	public String Validatestatus(ObjectsDTO obj) {
		if (obj.getStatus() == null) {
			return "exist_status_not_null";
		}
		return null;
	}
}
