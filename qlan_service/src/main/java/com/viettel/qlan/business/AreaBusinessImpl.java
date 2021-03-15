package com.viettel.qlan.business;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import com.viettel.base.common.BusinessException;
import com.viettel.qlan.bo.Area;
import com.viettel.qlan.constant.Constants;
import com.viettel.qlan.dao.ActionAuditDAO;
import com.viettel.qlan.dao.AreaDAO;
import com.viettel.qlan.dao.AuditDetailDAO;
import com.viettel.qlan.dto.AreaDTO;
import com.viettel.qlan.utils.QlanResource;
import com.viettel.qlan.utils.ValidateArea;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;

@Service("areaBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AreaBusinessImpl extends BaseFWBusinessImpl<AreaDAO, AreaDTO, Area> implements AreaBusiness {
	private static String TABLE_NAME = "AREA";
	private static String DISPLAY_NAME_KEY = "mng_area_name";

	@Autowired
	AreaDAO areaDAO;

	@Autowired
	AuditDetailDAO auditDetailDAO;

	@Autowired
	ActionAuditDAO actionAuditDAO;

	@Autowired
	ActionAuditBusinessImpl actionAuditBusinessImpl;

	public List<AreaDTO> getTree() {
		List<AreaDTO> list = areaDAO.getTree();
		return list;
	}

	public DataListDTO doSearch(AreaDTO areaDTO) {
		List<AreaDTO> list = areaDAO.doSearch(areaDTO);
		DataListDTO dataListDTO = new DataListDTO();

		dataListDTO.setData(list);
		dataListDTO.setSize(areaDTO.getTotalRecord());
		dataListDTO.setTotal(areaDTO.getTotalRecord());
		dataListDTO.setStart(1);

		return dataListDTO;

	}

	public DataListDTO doSearchChildren(AreaDTO areaDTO) {
		List<AreaDTO> list = areaDAO.doSearchChildren(areaDTO);
		DataListDTO dataListDTO = new DataListDTO();

		dataListDTO.setData(list);
		dataListDTO.setSize(areaDTO.getTotalRecord());
		dataListDTO.setTotal(areaDTO.getTotalRecord());
		dataListDTO.setStart(1);

		return dataListDTO;
	}

	public AreaDTO getAreaById(Long id) {
		AreaDTO areaDTO = areaDAO.getAreaById(id);
		return areaDTO;
	}

	public List<AreaDTO> getListAreaAutoSearch(AreaDTO obj) {
		return areaDAO.getListAreaAutoSearch(obj);
	}

	@Transactional
	public Long addArea(AreaDTO obj, HttpServletRequest request) {

		// Validate Form Add
		if (validateFormArea(obj) != null && validateFormArea(obj).length() > 0) {
			throw new BusinessException(validateFormArea(obj));
		}

		if (obj != null) {
			if (!areaDAO.checkDuplicateAreaCode(obj.getAreaCode())) {
				throw new BusinessException("Mã đơn vị " + obj.getAreaCode() + " đã tồn tại !");

			} else if (!areaDAO.checkDuplicateAreaName(obj.getAreaName(), null)) {
				throw new BusinessException("Tên đơn vị " + obj.getAreaName() + " đã tồn tại !");

			} else if (areaDAO.checkParentExist(obj.getParentId(), obj.getParentName())) {
				throw new BusinessException("Đơn vị cha không tồn tại !");
			} else {

				Long areaId = areaDAO.addArea(obj);
				return areaId;
			}

		} else {
			throw new BusinessException("Lỗi thêm mới đơn vị !");
		}
	}

	@Transactional
	public Long updateArea(AreaDTO obj, HttpServletRequest request) {
		// Validate Form Update
		if (validateFormArea(obj) != null && validateFormArea(obj).length() > 0) {
			throw new BusinessException(validateFormArea(obj));
		}

		if (obj != null && obj.getId() != null) {

			if (obj.getId().equals(obj.getParentId())) {
				throw new BusinessException("Đơn vị cha không được trùng với đơn vị trực thuộc " + obj.getParentName());

			} else if (!areaDAO.checkDeQuyArea(obj)) {
				throw new BusinessException(
						"Đơn vị " + obj.getParentName() + " là đơn vị con của " + obj.getAreaName() + " !");

			} else if (!areaDAO.checkDuplicateAreaName(obj.getAreaName(), obj.getId())) {
				throw new BusinessException("Tên đơn vị " + obj.getAreaName() + " đã tồn tại !");

			} else if (areaDAO.checkParentExist(obj.getParentId(), obj.getParentName())) {
				throw new BusinessException("Đơn vị cha không tồn tại !");
				
			} else {

				Long id = areaDAO.updateArea(obj);
				return id;
			}

		} else {
			throw new BusinessException("Đơn vị này chưa được cập nhật !");
		}
	}

	@Transactional
	public Long removeArea(AreaDTO obj, HttpServletRequest request) {
		if (obj != null) {
			if (!areaDAO.isCheckExistArea(obj.getId())) {
				throw new BusinessException("Xóa không thành công, đơn vị không tồn tại !");
			}
			if (areaDAO.isCheckDelArea(obj.getId())) {
				throw new BusinessException("Đơn vị này có đơn vị con trực thuộc không thể xóa !");
			}

			Long id = areaDAO.removeArea(obj);
			return id;

		} else {
			throw new BusinessException("Không thể xóa đơn vị này !");
		}
	}

	// message ==> file lang_VI.properties
	// Kiểm tra form
	public String validateFormArea(AreaDTO obj) {
		String errAreaCode = "";
		String errAreaName = "";
		String errStatus = "";

		if (validateAreaCode(obj) != null) {
			errAreaCode = QlanResource.get(validateAreaCode(obj)) + " </br>";
		}

		if (validateAreaName(obj) != null) {
			errAreaName = QlanResource.get(validateAreaName(obj)) + " </br>";
		}

		if (validateStatus(obj) != null) {
			errStatus = QlanResource.get(validateStatus(obj)) + " </br>";
		}

		String error = errAreaCode + errAreaName + errStatus;
		return error;
	}

	// Kiểm tra trường areaCode
	public String validateAreaCode(AreaDTO obj) {
		if (ValidateArea.isCheckNull(obj.getAreaCode())) {
			return "areaCode_is_not_empty";
		}

		if (ValidateArea.hasWhiteSpace(obj.getAreaCode())) {
			return "areaCode_has_not_white_space";
		}

		if (ValidateArea.isCheckSpecialCharacter(obj.getAreaCode())) {
			return "areaCode_is_not_special_character";
		}

		if (ValidateArea.isCheckSpecialCode(obj.getAreaCode())) {
			return "areaCode_is_not_special_character_code";
		}

		if (ValidateArea.htmlCheck(obj.getAreaCode())) {
			return "areaCode_is_not_html";
		}

		if (obj.getAreaCode().trim().length() > 100) {
			return "areaCode_max_length";
		}

		return null;
	}

	// Kiểm tra trường areaName
	public String validateAreaName(AreaDTO obj) {
		if (ValidateArea.isCheckNull(obj.getAreaName())) {
			return "areaName_is_not_empty";
		}

		if (ValidateArea.isCheckSpecialCharacter(obj.getAreaName())) {
			return "areaName_is_not_special_character";
		}

		if (ValidateArea.htmlCheck(obj.getAreaName())) {
			return "areaName_is_not_html";
		}

		if (obj.getAreaName().trim().length() > 100) {
			return "areaName_max_length";
		}

		return null;
	}

	// Kiểm tra trường status
	public String validateStatus(AreaDTO obj) {
		if (obj.getStatus() == null) {
			return "areaStatus_is_not_null";
		}
		return null;
	}

	// Kiểm tra khi add và update
	public String validateSaveInfo(AreaDTO obj) {

		// Trường hợp tạo mới
		if (obj.getId() == null) {
			if (!areaDAO.checkDuplicateAreaCode(obj.getAreaCode())) {
				return "areaCode_exist";

			} else if (!areaDAO.checkDuplicateAreaName(obj.getAreaName(), null)) {
				return "areaName_exist";
			}
		} else {
			// Trường hợp cập nhật
			if (obj.getId().equals(obj.getParentId())) {
				return "parent_not_duplicate";

			} else if (!areaDAO.checkDeQuyArea(obj)) {
				return "true_parent";

			} else if (!areaDAO.checkDuplicateAreaName(obj.getAreaName(), obj.getId())) {
				return "areaName_exist";

			}
		}

		return null;

	}

	// Kiểm tra khi delete
	public String validateDelete(AreaDTO obj) {
		if (!areaDAO.isCheckExistArea(obj.getId())) {
			return "area_is_not_exist";
		}
		if (areaDAO.isCheckDelArea(obj.getId())) {
			return "area_has_parent";
		}

		return null;
	}
}
