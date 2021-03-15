package com.viettel.qlan.dao;

import java.math.BigInteger;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.viettel.qlan.bo.Area;
import com.viettel.qlan.bo.Dept;
import com.viettel.qlan.bo.UserAlerts;
import com.viettel.qlan.dto.ApParamDTO;
import com.viettel.qlan.dto.AreaDTO;
import com.viettel.qlan.dto.DeptDTO;
import com.viettel.qlan.dto.UserAlertsDTO;
import com.viettel.qlan.utils.ValidateUtils;
import com.viettel.service.base.dao.BaseFWDAOImpl;

import oracle.net.aso.q;

@Repository("userAlertsDAO")
public class UserAlertsDAO extends BaseFWDAOImpl<UserAlerts, Long>{
	
	
	public UserAlertsDAO() {
		this.model = new UserAlerts();
	}
	public UserAlertsDAO(Session session) {
		this.session = session;
	}
	@SuppressWarnings("unchecked")
	public List<UserAlertsDTO> doSearch(UserAlertsDTO obj){
		StringBuilder sql = new StringBuilder(
				"SELECT user_alerts.STAFF_ID AS staffId, "
			+ "user_alerts.STAFF_CODE AS staffCode, "
			+ "user_alerts.NAME AS name, "
			+ "user_alerts.TEL AS tel, "
			+ "user_alerts.EMAIL AS email, "
			+ "user_alerts.DEPT_ID AS deptId, "
			+ "user_alerts.STATUS AS status, "
			+ "user_alerts.WARNING_LEVEL AS warningLevel, "
			+ "dept.DEPT_NAME AS deptName "
			+ "FROM user_alerts "
			+ " LEFT JOIN dept ON dept.DEPT_ID = user_alerts.DEPT_ID "
			+ "WHERE 1=1 "
				);
		if(StringUtils.isNotEmpty(obj.getStaffCode())) {
			sql.append("AND upper(user_alerts.STAFF_CODE) LIKE upper(:staffCode) escape '&' ");
		}
		if(StringUtils.isNotEmpty(obj.getTel())) {
			sql.append("AND upper(user_alerts.TEL) LIKE upper(:tel) escape '&' ");
		}
		if(StringUtils.isNotEmpty(obj.getName())) {
			sql.append("AND upper(user_alerts.NAME) LIKE upper(:name) escape '&' ");
		}
		if(obj.getDeptId() != null) {
			sql.append("AND user_alerts.DEPT_ID = :deptId ");
		}
		if(obj.getStatus() != null) {
			sql.append("AND user_alerts.`STATUS` = :status ");
		}
		if(obj.getWarningLevel() != null) {
			sql.append("AND user_alerts.WARNING_LEVEL = :warningLevel ");
		}
		sql.append(" ORDER BY user_alerts.NAME,user_alerts.STAFF_CODE");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		sqlCount.append(" as user_alerts;");
		
		SQLQuery query= getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount= getSession().createSQLQuery(sqlCount.toString());
		
		query.addScalar("staffId", new LongType());
		query.addScalar("staffCode", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("tel", new StringType());
		query.addScalar("email", new StringType());
		query.addScalar("deptId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("warningLevel", new LongType());
		query.addScalar("deptName", new StringType());
		
		query.setResultTransformer(Transformers.aliasToBean(UserAlertsDTO.class));
		
		if(StringUtils.isNotEmpty(obj.getStaffCode())) {
			query.setParameter("staffCode",  "%"+ ValidateUtils.validateKeySearch(obj.getStaffCode())+"%");
			queryCount.setParameter("staffCode",  "%"+ ValidateUtils.validateKeySearch(obj.getStaffCode())+"%");
		}
		if(StringUtils.isNotEmpty(obj.getTel())) {
			query.setParameter("tel",  "%"+ ValidateUtils.validateKeySearch(obj.getTel())+"%");
			queryCount.setParameter("tel",  "%"+ ValidateUtils.validateKeySearch(obj.getTel())+"%");
		}
		if(StringUtils.isNotEmpty(obj.getName())) {
			query.setParameter("name",  "%"+ ValidateUtils.validateKeySearch(obj.getName())+"%");
			queryCount.setParameter("name",  "%"+ ValidateUtils.validateKeySearch(obj.getName())+"%");
		}
		if(obj.getDeptId() != null) {
			query.setParameter("deptId", obj.getDeptId());
			queryCount.setParameter("deptId", obj.getDeptId());
		}
		if(obj.getStatus() != null) {
			query.setParameter("status", obj.getStatus());
			queryCount.setParameter("status", obj.getStatus());
		}
		if(obj.getWarningLevel() != null) {
			query.setParameter("warningLevel", obj.getWarningLevel());
			queryCount.setParameter("warningLevel", obj.getWarningLevel());
		}
		
		query.setFirstResult((obj.getPage().intValue()-1)*obj.getPageSize().intValue());
		query.setMaxResults(obj.getPageSize().intValue());
		obj.setTotalRecord(((BigInteger)queryCount.uniqueResult()).intValue());
		
		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	public List<ApParamDTO> getWarningLevel(){
		StringBuilder sql = new StringBuilder(
				"SELECT ap_param.AP_PARAM_ID AS apParamId, "
			+ "ap_param.CODE AS code, "
			+ "ap_param.NAME AS name, "
			+ "ap_param.VALUE AS value, "
			+ "ap_param.STATUS AS status, "
			+ "FROM ap_param "
			+ "WHERE ap_param.`STATUS` = 1 "
			+ "AND ap_param.TYPE = 'WL' "
				);
		sql.append("ORDER BY ap_param.NAME,ap_param.STAFF_CODE");
		SQLQuery query= getSession().createSQLQuery(sql.toString());
		query.setResultTransformer(Transformers.aliasToBean(ApParamDTO.class));
		return query.list();
	}
	
	// Check trùng StaffCode
	public UserAlertsDTO checkDuplicateStaffCode2(String staffCode) {
		String sql =
				"SELECT user_alerts.STAFF_ID AS staffId, "
				+ "user_alerts.DEPT_ID AS deptId, "
				+ "user_alerts.EMAIL AS email, "
				+ "user_alerts.NAME AS name, "
				+ "user_alerts.STAFF_CODE AS staffCode, "
				+ "user_alerts.STATUS AS status, "
				+ "user_alerts.TEL AS tel, "
				+ "user_alerts.WARNING_LEVEL AS warningLevel "
				+ "FROM user_alerts "
				+ "WHERE upper(user_alerts.STAFF_CODE) =:staffCode"
				;
		SQLQuery query = getSession().createSQLQuery(sql);
		query.addScalar("staffId", new LongType());
		query.addScalar("staffCode", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("tel", new StringType());
		query.addScalar("email", new StringType());
		query.addScalar("deptId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("warningLevel", new LongType());
		
		query.setParameter("staffCode", staffCode);
		query.setResultTransformer(Transformers.aliasToBean(UserAlertsDTO.class));
		return (UserAlertsDTO) query.uniqueResult();
	}
	public UserAlertsDTO getById(Long id) {
		String sql =
				"SELECT user_alerts.STAFF_ID AS staffId, "
				+ "user_alerts.DEPT_ID AS deptId, "
				+ "user_alerts.EMAIL AS email, "
				+ "user_alerts.NAME AS name, "
				+ "user_alerts.STAFF_CODE AS staffCode, "
				+ "user_alerts.STATUS AS status, "
				+ "user_alerts.TEL AS tel, "
				+ "user_alerts.WARNING_LEVEL AS warningLevel "
				+ "FROM user_alerts "
				+ "WHERE user_alerts.STAFF_ID =:staffId"
				;
		SQLQuery query = getSession().createSQLQuery(sql);
		query.addScalar("staffId", new LongType());
		query.addScalar("staffCode", new StringType());
		query.addScalar("name", new StringType());
		query.addScalar("tel", new StringType());
		query.addScalar("email", new StringType());
		query.addScalar("deptId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("warningLevel", new LongType());
		
		query.setParameter("staffId", id);
		query.setResultTransformer(Transformers.aliasToBean(UserAlertsDTO.class));
		return (UserAlertsDTO) query.uniqueResult();
	}
	
	
	// Thêm UserAlert vào bảng UserAlerts
	@Transactional	
	public long addUserAlert(UserAlertsDTO obj) {

		try {
			Session session = getSession();
			UserAlerts uAlert = new  UserAlerts();
			 uAlert.setStaffCode(obj.getStaffCode());
			 uAlert.setName(obj.getName());
			 uAlert.setTel(obj.getTel());
			 uAlert.setEmail(obj.getEmail());
			 uAlert.setStatus(obj.getStatus());
			 uAlert.setWarningLevel(obj.getWarningLevel());
			 uAlert.setDeptId(obj.getDeptId());
			 
			 Long id = (Long) session.save(uAlert);
			
			 return id;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return 1L;
	}
	// Xóa UserAlert
	@Transactional
	public long removeUserAlert(UserAlertsDTO obj) {
		try {
			Session session = getSession();
			UserAlerts uAlert = new  UserAlerts();
			uAlert.setStaffId(obj.getStaffId());
			session.delete(uAlert);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return obj.getStaffId();
	}
	// Cập nhật UserAlert
	@Transactional
	public long updateUserAlert(UserAlertsDTO obj) {
		try {
			Session session = getSession();
			UserAlerts uAlert = new  UserAlerts();
			uAlert.setStaffId(obj.getStaffId());
			uAlert.setStaffCode(obj.getStaffCode());
			uAlert.setName(obj.getName());
			uAlert.setTel(obj.getTel());
			uAlert.setEmail(obj.getEmail());
			uAlert.setStatus(obj.getStatus());
			uAlert.setWarningLevel(obj.getWarningLevel());
			uAlert.setDeptId(obj.getDeptId());
			session.update(uAlert);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return obj.getStaffId();
	}
}
