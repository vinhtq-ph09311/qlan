
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

import com.viettel.qlan.bo.Dept;
import com.viettel.qlan.dto.DeptDTO;
import com.viettel.qlan.utils.ValidateUtils;
import com.viettel.service.base.dao.BaseFWDAOImpl;


@Repository("deptDAO")
public class DeptDAO extends BaseFWDAOImpl<Dept, Long> {

	public DeptDAO() {
		this.model = new Dept();
	}

	public DeptDAO(Session session) {
		this.session = session;
	}

	public List<DeptDTO> getTree() {
		StringBuilder sql = new StringBuilder("SELECT"
						+ " dept.DEPT_ID AS deptId," 
						+ " dept.DEPT_NAME AS deptName,"
						+ " dept.PARENT_DEPT_ID AS parentDeptId,"
						+ " dept.STATUS AS status,"
						+ " dept.DEPT_CODE AS deptCode"
						+ " FROM dept ORDER BY dept.DEPT_CODE");

		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("deptId", new LongType());
		query.addScalar("deptName", new StringType());
		query.addScalar("parentDeptId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("deptCode", new StringType());

		query.setResultTransformer(Transformers.aliasToBean(DeptDTO.class));

		return query.list();

	}

	public List<DeptDTO> doSearch(DeptDTO obj) {

		StringBuilder sql = new StringBuilder("SELECT"
				+ " dept.DEPT_ID AS deptId,"
				+ " dept.DEPT_CODE AS deptCode," 
				+ " dept.DEPT_NAME AS deptName,"
				+ " dept.PARENT_DEPT_ID AS parentDeptId,"
				+ " p.DEPT_NAME AS parentDeptName," 
				+ " dept.STATUS AS status" 
				+ " FROM dept LEFT JOIN dept AS p"
				+ " ON dept.PARENT_DEPT_ID = p.DEPT_ID WHERE 1=1");
		
		if(StringUtils.isNotEmpty(obj.getDeptCode())) {
			sql.append(" AND UPPER(dept.DEPT_CODE) LIKE UPPER(:deptCode) escape '&'");
		}
		
		if(StringUtils.isNotEmpty(obj.getDeptName())) {
			sql.append(" AND UPPER(dept.DEPT_NAME) LIKE UPPER(:deptName) escape '&'");
		}
		
		if(obj.getStatus()!=null) {
			sql.append(" AND dept.STATUS = :deptStatus");		
		}
		
		if(obj.getDeptId()!=null) {
			sql.append(" AND dept.DEPT_ID = :deptId" );
		}
		
		sql.append(" ORDER BY dept.DEPT_CODE");

		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		sqlCount.append(" as objects;");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());
		
		query.addScalar("deptId", new LongType());
		query.addScalar("deptCode", new StringType());
		query.addScalar("deptName", new StringType());
		query.addScalar("parentDeptId", new LongType());
		query.addScalar("parentDeptName", new StringType());
		query.addScalar("status", new LongType());

		query.setResultTransformer(Transformers.aliasToBean(DeptDTO.class));
		
		if(StringUtils.isNotEmpty(obj.getDeptCode())) {
			query.setParameter("deptCode", "%"+ValidateUtils.validateKeySearch(obj.getDeptCode().trim()) + "%");
			queryCount.setParameter("deptCode", "%"+ValidateUtils.validateKeySearch(obj.getDeptCode().trim()) + "%");
		}
		
		
		if(StringUtils.isNotEmpty(obj.getDeptName())) {
		    query.setParameter("deptName", "%"+ValidateUtils.validateKeySearch(obj.getDeptName().trim())+"%");
		    queryCount.setParameter("deptName", "%"+ValidateUtils.validateKeySearch(obj.getDeptName().trim())+"%");
		}
		
		if(obj.getStatus() !=null) {
			query.setParameter("deptStatus", obj.getStatus());
			queryCount.setParameter("deptStatus", obj.getStatus());
		}
		
		if(obj.getDeptId()!=null) {
			query.setParameter("deptId", obj.getDeptId());
			queryCount.setParameter("deptId", obj.getDeptId());
		}

		query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
		query.setMaxResults(obj.getPageSize().intValue());
		obj.setTotalRecord(((BigInteger) queryCount.uniqueResult()).intValue());

		return query.list();
	}

	public List<DeptDTO> doSearchChildren(DeptDTO obj) {
		
		StringBuilder sql = new StringBuilder("SELECT"
				+ " dept.DEPT_ID AS deptId," 
				+ " dept.DEPT_NAME AS deptName,"
				+ " dept.PARENT_DEPT_ID AS parentDeptId,"
				+ " dept.DEPT_CODE AS deptCode," 
				+ " dept.STATUS AS status,"
				+ " p.DEPT_NAME AS parentDeptName" 
				+ " FROM dept LEFT JOIN dept AS p"
				+ " ON dept.PARENT_DEPT_ID = p.DEPT_ID");
		
		if(obj.getDeptId() != null) {
			sql.append(" WHERE dept.PARENT_DEPT_ID = (:parentDeptId) ");
		}

		sql.append(" ORDER BY dept.DEPT_CODE");

		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM (");
		sqlCount.append(sql.toString());
		sqlCount.append(")");
		sqlCount.append(" as objects;");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("deptId", new LongType());
		query.addScalar("deptCode", new StringType());
		query.addScalar("deptName", new StringType());
		query.addScalar("parentDeptId", new LongType());
		query.addScalar("parentDeptName", new StringType());
		query.addScalar("status", new LongType());

		query.setResultTransformer(Transformers.aliasToBean(DeptDTO.class));
		
		if(obj.getDeptId() !=null) {
			query.setParameter("parentDeptId", obj.getDeptId());
			queryCount.setParameter("parentDeptId", obj.getDeptId());
		}

		query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
		query.setMaxResults(obj.getPageSize().intValue());
		obj.setTotalRecord(((BigInteger) queryCount.uniqueResult()).intValue());

		return query.list();

	}

	public DeptDTO getDeptById(Long deptId) {
		StringBuilder sql = new StringBuilder("SELECT"
				+ " dept.DEPT_ID AS deptId," 
				+ " dept.DEPT_NAME AS deptName,"
				+ " dept.PARENT_DEPT_ID AS parentDeptId," 
				+ " dept.STATUS AS status,"
				+ " dept.DEPT_CODE AS deptCode"
				+ " FROM dept WHERE (dept.DEPT_ID) = (:deptId)");

		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("deptId", new LongType());
		query.addScalar("deptCode", new StringType());
		query.addScalar("deptName", new StringType());
		query.addScalar("parentDeptId", new LongType());
		query.addScalar("status", new LongType());

		query.setResultTransformer(Transformers.aliasToBean(DeptDTO.class));

		query.setParameter("deptId", deptId);

		DeptDTO dept = (DeptDTO) query.uniqueResult();

		return dept;

	}
	
	public List<DeptDTO> getListDept(DeptDTO obj) {
		StringBuilder sql = new StringBuilder("SELECT"
				+ " dept.DEPT_ID AS deptId,"
				+ " dept.DEPT_NAME AS deptName,"
				+ " dept.DEPT_CODE AS deptCode"
				+ " FROM dept WHERE 1=1");
		
		if(StringUtils.isNotEmpty(obj.getDeptName())) {
			sql.append(" AND UPPER(dept.DEPT_NAME) LIKE UPPER(:deptName) escape '&'");
			sql.append(" OR UPPER(dept.DEPT_CODE) LIKE UPPER(:deptName) escape '&'");
		}
		
		SQLQuery query = getSession().createSQLQuery( sql.toString() );
		query.addScalar("deptId", new LongType());
		query.addScalar("deptCode", new StringType());
		query.addScalar("deptName", new StringType());
		
		if(StringUtils.isNotEmpty(obj.getDeptName())) {
			query.setParameter("deptName", "%"+ValidateUtils.validateKeySearch(obj.getDeptName())+"%");
		}
		
		query.setResultTransformer( Transformers.aliasToBean(DeptDTO.class));

		return query.list();
	}
	
	public DeptDTO findByName(String deptName) {
		StringBuilder sql = new StringBuilder("SELECT"
				+ " dept.DEPT_ID AS deptId," 
				+ " dept.DEPT_NAME AS deptName,"
				+ " dept.PARENT_DEPT_ID AS parentDeptId," 
				+ " dept.STATUS AS status,"
				+ " dept.DEPT_CODE AS deptCode"
				+ " FROM dept WHERE (dept.DEPT_NAME) = (:deptName)");

		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("deptId", new LongType());
		query.addScalar("deptCode", new StringType());
		query.addScalar("deptName", new StringType());
		query.addScalar("parentDeptId", new LongType());
		query.addScalar("status", new LongType());

		query.setResultTransformer(Transformers.aliasToBean(DeptDTO.class));

		query.setParameter("deptName", deptName);

		List<DeptDTO> listDept = query.list();
		
		if(listDept != null && listDept.size() > 0) {
			return listDept.get(0);
		}

		return null;
	}
	
	public DeptDTO findByCode(String deptCode) {
		StringBuilder sql = new StringBuilder("SELECT"
				+ " dept.DEPT_ID AS deptId," 
				+ " dept.DEPT_NAME AS deptName,"
				+ " dept.PARENT_DEPT_ID AS parentDeptId," 
				+ " dept.STATUS AS status,"
				+ " dept.DEPT_CODE AS deptCode"
				+ " FROM dept WHERE (dept.DEPT_CODE) = (:deptCode)");

		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("deptId", new LongType());
		query.addScalar("deptCode", new StringType());
		query.addScalar("deptName", new StringType());
		query.addScalar("parentDeptId", new LongType());
		query.addScalar("status", new LongType());

		query.setResultTransformer(Transformers.aliasToBean(DeptDTO.class));

		query.setParameter("deptCode", deptCode);

		List<DeptDTO> listDept = query.list();
		
		if(listDept != null && listDept.size() > 0) {
			return listDept.get(0);
		}

		return null;
	}
	
	@Transactional
	public long add(DeptDTO obj) {
		try {
			Session session = getSession();
			
			Dept newDept = new Dept();
			newDept.setDeptName(obj.getDeptName());
			newDept.setParentDeptId(obj.getParentDeptId());
			newDept.setStatus(obj.getStatus());
			newDept.setDeptCode(obj.getDeptCode());
			
			Long id = (Long) session.save(newDept);
			return id;
		} catch (Exception e) {
				e.printStackTrace();
		}
		
		return 1L;		
	}
	
	@Transactional
	public long update(DeptDTO obj) {
		try {
			Session session = getSession();
			
			Dept existDept = new Dept();
			existDept.setDeptId(obj.getDeptId());
			existDept.setDeptName(obj.getDeptName());
			existDept.setParentDeptId(obj.getParentDeptId());
			existDept.setStatus(obj.getStatus());
			existDept.setDeptCode(obj.getDeptCode());
				
			session.update(existDept);
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		return obj.getDeptId();
	}
	
	// listDeptUnder: lấy tất cả phòng ban trực thuộc 
	public List<DeptDTO> listDeptUnder(DeptDTO obj) {
		// Sử dụng with để đệ quy lấy tất cả pb con cháu
		StringBuilder sql= new StringBuilder("WITH RECURSIVE"
				+ " temp(DEPT_ID, DEPT_NAME)"
				+ " AS ("
				+ " SELECT DEPT_ID, DEPT_NAME FROM dept"
				+ " WHERE PARENT_DEPT_ID = (:parentDeptId)"
				+ " UNION ALL"
				+ " SELECT b.DEPT_ID, b.DEPT_NAME"
				+ " FROM temp AS a, dept AS b"
				+ " WHERE a.DEPT_ID = b.PARENT_DEPT_ID"
				+ " )"
				+ " SELECT DEPT_ID AS deptId, DEPT_NAME AS deptName FROM temp");
		
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("deptId", new LongType());
		query.addScalar("deptName", new StringType());
		
		query.setResultTransformer(Transformers.aliasToBean(DeptDTO.class));
		
		query.setParameter("parentDeptId", obj.getDeptId());
		
		return query.list();
		
	}
	
	@Transactional
	public long remove(DeptDTO obj) {
		try {
			Session session = getSession();
			Dept dept = new Dept();
			dept.setDeptId(obj.getDeptId());
			
			session.delete(dept);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return obj.getDeptId();
	}
	
	//check dept before delete
	public List<DeptDTO> listUsersExistDept(DeptDTO obj) {
		StringBuilder sql = new StringBuilder("SELECT"
				+ " users.DEPT_ID AS deptId"
				+ " FROM users"
				+ " WHERE DEPT_ID = (:deptId)");
		
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("deptId", new LongType());
		
		query.setResultTransformer(Transformers.aliasToBean(DeptDTO.class));
		
		query.setParameter("deptId", obj.getDeptId());
		
		return query.list();	
	}
	
	public List<DeptDTO> listUserAlertsExistDept(DeptDTO obj) {
		StringBuilder sql = new StringBuilder("SELECT"
				+ " user_alerts.DEPT_ID AS deptId"
				+ " FROM user_alerts"
				+ " WHERE DEPT_ID = (:deptId)");
		
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("deptId", new LongType());
		
		query.setResultTransformer(Transformers.aliasToBean(DeptDTO.class));
		
		query.setParameter("deptId", obj.getDeptId());
		
		return query.list();	
	}
	
	public List<DeptDTO> listStaffCBVExistDept(DeptDTO obj) {
		StringBuilder sql = new StringBuilder("SELECT"
				+ " staff_cbv.DEPT_CODE AS deptCode"
				+ " FROM staff_cbv"
				+ " WHERE UPPER (DEPT_CODE) = UPPER(:deptCode)");
		
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("deptCode", new StringType());
		
		query.setResultTransformer(Transformers.aliasToBean(DeptDTO.class));
		
		query.setParameter("deptCode", obj.getDeptCode());
		
		return query.list();	
	}
	
	public List<DeptDTO> listSmsAlertExistDept(DeptDTO obj) {
		StringBuilder sql = new StringBuilder("SELECT"
				+ " sms_alert.DEPT_ID AS deptId"
				+ " FROM sms_alert"
				+ " WHERE DEPT_ID = (:deptId)");
		
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("deptId", new LongType());
		
		query.setResultTransformer(Transformers.aliasToBean(DeptDTO.class));
		
		query.setParameter("deptId", obj.getDeptId());
		
		return query.list();
	}
	
}




































































































































































































































































































































































