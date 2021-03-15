
package com.viettel.qlan.business;

import java.util.List;

import org.apache.log4j.Logger;
import org.opensaml.xmlsec.encryption.Q;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import com.viettel.base.common.BusinessException;
import com.viettel.qlan.bo.Dept;
import com.viettel.qlan.dao.DeptDAO;
import com.viettel.qlan.dto.DeptDTO;
import com.viettel.qlan.utils.QlanResource;
import com.viettel.qlan.utils.ValidateDept;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import com.viettel.util.ValidateUtils;


@Service("deptBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class DeptBusinessImpl extends BaseFWBusinessImpl<DeptDAO, DeptDTO, Dept> implements DeptBusiness {
	
	private static final Logger log = Logger.getLogger(DeptBusinessImpl.class);
	private static String INVALID_ACC_KEY="invalid.account";
	private static String DISPLAY_NAME_KEY="dept.management.display.name";
	private static String TABLE_NAME="DEPT";
	private static String ACCOUNT_VI_KEY="account_vi";
	private static String INVALID_VI_KEY="invalid_vi";
	
	@Autowired
	private DeptDAO deptDAO;
	
	@Autowired
	ActionAuditBusinessImpl actionAuditBusinessImpl;
	
	public DeptBusinessImpl() {
		tModel = new Dept();
		tDAO = deptDAO;
	}

	public DeptDAO gettDAO() {
		return deptDAO;
	}
	
	
	public DataListDTO doSearch(DeptDTO obj) {
		List<DeptDTO> list = deptDAO.doSearch(obj);
		DataListDTO data = new DataListDTO();
		data.setData(list);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getTotalRecord());
		data.setStart(1);

		return data;
	}
	
	public DataListDTO doSearchChildren(DeptDTO obj) {
		List<DeptDTO> list = deptDAO.doSearchChildren(obj);
		DataListDTO data = new DataListDTO();
		data.setData(list);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getTotalRecord());
		data.setStart(1);

		return data;
	}

	public List<DeptDTO> getTree() {
		List<DeptDTO> list = deptDAO.getTree();
		return list;
	}
	
	public DeptDTO getDeptById(Long deptId) {
		DeptDTO dept = deptDAO.getDeptById(deptId);
		return dept;
	}
	
	public List<DeptDTO> getListDept(DeptDTO obj) {
		List<DeptDTO> list = deptDAO.getListDept(obj);
		return list;
	}
	
	public Long add(DeptDTO obj) {
		if (obj != null && ValidateFormInput(obj) && checkDeptBeforeSave(obj)) {
				long id = deptDAO.add(obj);
				return id;
		}else {
			throw new BusinessException("Lỗi thêm mới phòng ban !");
		}
	}
	
	public Long update(DeptDTO obj) {
		if (obj != null && ValidateFormInput(obj) && checkDeptBeforeSave(obj)) {
				long id = deptDAO.update(obj);
				return id;
		}else {
			throw new BusinessException("Lỗi cập nhật phòng ban !");
		}
	}
	
	public Long remove(DeptDTO obj) {		
		if(obj != null && checkDeptBeforeDelete(obj)) {
				long id = deptDAO.remove(obj);
				return id;
		}else {
			throw new BusinessException(QlanResource.get("dublicate_detpt_not_Dept"));
		}
	}
	
	// kiểm tra xem phòng ban có còn tồn tại phòng ban trực thuộc k
	public boolean isDeptUnique(DeptDTO obj) {
		List<DeptDTO> listChild = deptDAO.listDeptUnder(obj);
		DeptDTO existParentDept = getDeptById(obj.getParentDeptId());
		
		if(existParentDept != null && existParentDept.getParentDeptId() != 0) {
			for (int i = 0; i < listChild.size(); i++) {
				if(listChild.get(i).getDeptId().equals(existParentDept.getDeptId())) {
					return false;
				}
			}
		}
		
		return true;
	}
	
	public boolean ValidateFormInput(DeptDTO obj) {
		// tên phòng ban không để trống
		if(ValidateDept.Ischecknull(obj.getDeptName())) {
			throw new BusinessException(QlanResource.get("exist_deptName_null"));
		}
		
		// mã phòng ban không để trống
		if(ValidateDept.Ischecknull(obj.getDeptCode())) {
			throw new BusinessException(QlanResource.get("exist_deptcode_null"));
		}
		
		// trạng thái không để trống
		if(ValidateDept.checkDeptStatus(obj.getStatus())) {
			throw new BusinessException(QlanResource.get("exist_deptStatus_null"));
		}
		
		// tên phòng ban không quá 100 kí tự
		if(ValidateDept.checkMaxLength(obj.getDeptName())) {
			throw new BusinessException(QlanResource.get("exist_detpt_not_maxlength_Name"));
		}
		
		// mã phòng ban không quá 100 kí tự
		if(ValidateDept.checkMaxLength(obj.getDeptCode())) {
			throw new BusinessException(QlanResource.get("exist_detpt_not_maxlength_Code"));
		}
		
		// Tên phòng ban không nhập ký tự đặc biệt!
		if(ValidateDept.IscheckspecialCharacter(obj.getDeptName())) {
			throw new BusinessException(QlanResource.get("exist_detpt_not_Character_Name"));
		}
		
		//  Mã phòng ban không nhập ký tự đặc biệt!
		if(ValidateDept.IscheckspecialCharacter(obj.getDeptCode())) {
			throw new BusinessException(QlanResource.get("exist_detpt_not_Character"));
		}
		
		// Tên phòng ban không nhập  thẻ HTML !
		if(ValidateDept.htmlCheck(obj.getDeptName())) {
			throw new BusinessException(QlanResource.get("exist_detpt_not_Html_Code_Name"));
		}
		
		// Mã phòng ban không nhập  thẻ HTML !
		if(ValidateDept.htmlCheck(obj.getDeptCode())) {
			throw new BusinessException(QlanResource.get("exist_detpt_not_Html_Code"));
		}
		
		// Mã phòng ban không nhập có dấu!
		if(ValidateDept.IsCheckspecialCharacterCode(obj.getDeptCode())) {
			throw new BusinessException(QlanResource.get("exist_detpt_not_Character_Code"));
		}
		
		// Mã phòng ban không nhập khoảng trắng!
		if(ValidateDept.hasWhiteSpace(obj.getDeptCode())) {
			throw new BusinessException(QlanResource.get("exist_detpt_not_Space_Code"));
		}
		
		return true;
	}
	
	public boolean checkDeptBeforeSave(DeptDTO obj) {
		boolean isCreateNew = (obj.getDeptId() == null);
		DeptDTO deptByName = deptDAO.findByName(obj.getDeptName());
		DeptDTO deptByCode = deptDAO.findByCode(obj.getDeptCode());
		DeptDTO deptParent = deptDAO.findByName(obj.getParentDeptName());
		
		if(isCreateNew) {
			// Tên phòng ban đã tồn tại
			if(deptByName != null) {
				throw new BusinessException(QlanResource.get("dublicate.deptname"));
			}
			
			// Mã phòng ban đã tồn tại!
			if(deptByCode != null) {
				throw new BusinessException(QlanResource.get("exist_dept_of_trung"));
			}
			
			// Phòng ban cha không tồn tại !
			if(deptParent == null && !obj.getParentDeptName().isEmpty()) {
				throw new BusinessException(QlanResource.get("dublicate_detpt_not_Parent"));
			}
			
		}else {
			
			DeptDTO deptbyId = deptDAO.getDeptById(obj.getDeptId());
			
			// Tên phòng ban đã tồn tại
			if(deptByName != null && deptbyId.getDeptId() != deptByName.getDeptId()) {
				throw new BusinessException(QlanResource.get("dublicate.deptname"));
			}
			
			// Mã phòng ban đã tồn tại!
			if (deptByCode != null && deptbyId.getDeptId() != deptByCode.getDeptId()) {
				throw new BusinessException(QlanResource.get("exist_dept_of_trung"));	
			}
			
			// phòng ban cha phải không nằm trong danh sách trực thuộc của phòng ban này!
			if (!isDeptUnique(obj)) {
				throw new BusinessException(QlanResource.get("exist_deptChild_of"));
			}
			
			// Mã phòng ban không được Cập nhật !
			if(!deptbyId.getDeptCode().equals(obj.getDeptCode())) { 
				throw new BusinessException(QlanResource.get("exist_dept_of_edit_DeptCode"));
			}
			
			// Phòng ban cha không tồn tại !
			if(deptParent == null && !obj.getParentDeptName().isEmpty()) {
				throw new BusinessException(QlanResource.get("dublicate_detpt_not_Parent"));
			}
		}
		
		return true;
	}
	
	public boolean checkDeptBeforeDelete(DeptDTO obj) {
		DeptDTO deptbyId = deptDAO.getDeptById(obj.getDeptId());
		List<DeptDTO> listChild = deptDAO.listDeptUnder(obj);
		List<DeptDTO> listByUsers = deptDAO.listUsersExistDept(obj);
		List<DeptDTO> listByUserAlerts = deptDAO.listUserAlertsExistDept(obj);
		List<DeptDTO> listBySmsAlert = deptDAO.listSmsAlertExistDept(obj);
		List<DeptDTO> listByStaffCBV = deptDAO.listStaffCBVExistDept(obj);
		
		// Xóa không thành công, phòng ban không tồn tại !
		if(deptbyId == null) {
			throw new BusinessException(QlanResource.get("exist_dept_of_Id"));
		}
		
		// Xóa không thành công, vẫn còn Phòng ban được gán cho phòng ban này!
		if(listChild != null && listChild.size() > 0) {
			throw new BusinessException(QlanResource.get("exist_dept_of"));
		}
		
		// Xóa không thành công, vẫn còn người dùng được gán cho phòng ban này!
		if(listByUsers != null && listByUsers.size() > 0) {
			throw new BusinessException(QlanResource.get("exist_dept_of_user"));
		}
		
		// Xóa không thành công, vẫn còn người dùng được gán cho phòng ban này! From user_alert
		if(listByUserAlerts != null && listByUserAlerts.size() > 0) {
			throw new BusinessException(QlanResource.get("exist_dept_of_user"));
		}
		
		// Xóa không thành công, vẫn còn người dùng CBV được gán cho phòng ban này!
		if(listByStaffCBV != null && listByStaffCBV.size() > 0) {
			throw new BusinessException(QlanResource.get("exist_dept_of_Staff_CBV"));
		}
		
		// Xóa không thành công, vẫn còn Chức năng được gán cho phòng ban này! From sms_alert
		if(listBySmsAlert != null && listBySmsAlert.size() > 0) {
			throw new BusinessException(QlanResource.get("exist_dept_of_Staff_Alert"));
		}
		
		return true;
	}
	

}
