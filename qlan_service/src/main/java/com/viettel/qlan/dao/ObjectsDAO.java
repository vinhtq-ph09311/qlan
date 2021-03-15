package com.viettel.qlan.dao;

import java.math.BigInteger;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.viettel.qlan.bo.Objects;
import com.viettel.qlan.dto.ObjectsDTO;
import com.viettel.qlan.utils.ValidateUtils;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@Repository("objectsDAO")
public class ObjectsDAO extends BaseFWDAOImpl<Objects, Long> {
	private static final boolean StringUtil = false;

	public ObjectsDAO() {
		this.model = new Objects();
	}

	public ObjectsDAO(Session session) {
		this.session = session;
	}

	@SuppressWarnings("unchecked")
	public List<ObjectsDTO> getListObjects(Long userId, Long parentId) {
		StringBuilder sql = new StringBuilder("SELECT DISTINCT ");
		sql.append(" obj.OBJECT_ID AS objectId,");
		sql.append(" obj.PARENT_ID AS parentId,");
		sql.append(" obj.`STATUS` AS `status`,");
		sql.append(" obj.ORD AS ord,");
		sql.append(" obj.OBJECT_URL AS objectUrl,");
		sql.append(" obj.OBJECT_NAME AS objectName,");
		sql.append(" obj.DESCRIPTION AS description,");
		sql.append(" obj.OBJECT_TYPE_ID AS objectTypeId,");
		sql.append(" obj.OBJECT_CODE AS objectCode,");
		sql.append(" obj.CREATE_USER AS createUser,");
		sql.append(" obj.CREATE_DATE AS createDate");
		sql.append(" FROM objects AS obj  ");

		if (parentId != null) {
			sql.append(" JOIN role_object on obj.OBJECT_ID=role_object.OBJECT_ID");
			sql.append(" JOIN role_user ON role_user.ROLE_ID=role_object.ROLE_ID");
			sql.append(
					" WHERE role_user.USER_ID=:userId AND role_user.IS_ACTIVE=1 AND role_object.IS_ACTIVE=1 AND obj.`STATUS`=1 ");
			sql.append(" AND obj.PARENT_ID =:parentId ");
		} else {
			sql.append(" WHERE obj.OBJECT_ID IN (SELECT objects.PARENT_ID FROM  objects ");
			sql.append(" JOIN role_object on objects.OBJECT_ID=role_object.OBJECT_ID");
			sql.append(" JOIN role_user ON role_user.ROLE_ID=role_object.ROLE_ID");
			sql.append(
					" WHERE role_user.USER_ID=:userId AND role_user.IS_ACTIVE=1 AND role_object.IS_ACTIVE=1  ) AND obj.`STATUS`=1 ");
		}
		sql.append(" ORDER BY obj.ORD ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("objectId", new LongType());
		query.addScalar("parentId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("ord", new LongType());
		query.addScalar("objectUrl", new StringType());
		query.addScalar("objectName", new StringType());
		query.addScalar("description", new StringType());
		query.addScalar("objectTypeId", new LongType());
		query.addScalar("objectCode", new StringType());
		query.addScalar("createUser", new StringType());
		query.addScalar("createDate", new DateType());

		query.setResultTransformer(Transformers.aliasToBean(ObjectsDTO.class));

		query.setParameter("userId", userId);
		if (parentId != null) {
			query.setParameter("parentId", parentId);
		}

		return query.list();
	}
	///  dua du lieu vao bang va tim kiem
	@SuppressWarnings("unchecked")
	public List<ObjectsDTO> getAllObjects(ObjectsDTO obj) {
		StringBuilder sql = new StringBuilder("SELECT DISTINCT ");
		sql.append(" obj.OBJECT_ID AS objectId,");
		sql.append(" obj.PARENT_ID AS parentId,");
		sql.append(" obj.`STATUS` AS `status`,");
		sql.append(" obj.ORD AS ord,");
		sql.append(" obj.OBJECT_URL AS objectUrl,");
		sql.append(" obj.OBJECT_NAME AS objectName,");
		sql.append(" obj.DESCRIPTION AS description,");
		sql.append(" obj.OBJECT_TYPE_ID AS objectTypeId,");
		sql.append(" obj.OBJECT_CODE AS objectCode,");
		sql.append(" obj.CREATE_USER AS createUser,");
		sql.append(" obj.CREATE_DATE AS createDate,");
		sql.append(" o2.OBJECT_NAME AS parentName ");
		sql.append(" FROM objects AS obj left join objects o2 on obj.PARENT_ID = o2.OBJECT_ID ");
		sql.append(" WHERE 1=1  ");

		/// timf theo max chuc nang
		if (StringUtils.isNotEmpty(obj.getObjectCode())) {
			sql.append("AND upper(obj.OBJECT_CODE) LIKE upper(:objectCode) escape '&' ");
		}
		/// tim theo ten chuc nang
		if (StringUtils.isNotEmpty(obj.getObjectName())) {
			sql.append("AND upper(obj.OBJECT_NAME) LIKE upper(:objectName) escape '&' ");
		}

		/// tim theo chuc nang cha
		if (obj.getParentId() != null) {
			sql.append("AND obj.PARENT_ID = :parentId");
		}
		/// tim theo loai chuc nang
		if (obj.getObjectTypeId() != null) {
			sql.append(" AND obj.`OBJECT_TYPE_ID` = :objectTypeId");
		}
		/// tim theo trang thai
		if (obj.getStatus() != null) {
			sql.append(" AND obj.`STATUS` = :status");
		}

		sql.append(" ORDER BY obj.ORD ");

		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM ( ");
		sqlCount.append(sql.toString());
		sqlCount.append(" ) ");
		sqlCount.append(" as objects;");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("objectId", new LongType());
		query.addScalar("parentId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("ord", new LongType());
		query.addScalar("objectUrl", new StringType());
		query.addScalar("objectName", new StringType());
		query.addScalar("description", new StringType());
		query.addScalar("objectTypeId", new LongType());
		query.addScalar("objectCode", new StringType());
		query.addScalar("createUser", new StringType());
		query.addScalar("createDate", new DateType());
		query.addScalar("parentName", new StringType());

		query.setResultTransformer(Transformers.aliasToBean(ObjectsDTO.class));

		if (StringUtils.isNotEmpty(obj.getObjectCode())) {
			query.setParameter("objectCode", "%" + ValidateUtils.validateKeySearch(obj.getObjectCode()) + "%");
			queryCount.setParameter("objectCode", "%" + ValidateUtils.validateKeySearch(obj.getObjectCode()) + "%");
		}
		if (StringUtils.isNotEmpty(obj.getObjectName())) {
			query.setParameter("objectName", "%" + ValidateUtils.validateKeySearch(obj.getObjectName()) + "%");
			queryCount.setParameter("objectName", "%" + ValidateUtils.validateKeySearch(obj.getObjectName()) + "%");
		}
		if (obj.getParentId() != null) {
			query.setParameter("parentId", obj.getParentId());
			queryCount.setParameter("parentId", obj.getParentId());
		}
		if (obj.getObjectTypeId() != null) {
			query.setParameter("objectTypeId", obj.getObjectTypeId());
			queryCount.setParameter("objectTypeId", obj.getObjectTypeId());
		}
		if (obj.getStatus() != null) {
			query.setParameter("status", obj.getStatus());
			queryCount.setParameter("status", obj.getStatus());
		}

		// phan trang
		query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
		query.setMaxResults(obj.getPageSize().intValue());
		obj.setTotalRecord(((BigInteger) queryCount.uniqueResult()).intValue());

		return query.list();
	}

	public ObjectsDTO getObjectInfo(long objectId) {
		StringBuilder sql = new StringBuilder("SELECT DISTINCT ");
		sql.append(" obj.OBJECT_ID AS objectId,");
		sql.append(" obj.PARENT_ID AS parentId,");
		sql.append(" obj.`STATUS` AS `status`,");
		sql.append(" obj.ORD AS ord,");
		sql.append(" obj.OBJECT_URL AS objectUrl,");
		sql.append(" obj.OBJECT_NAME AS objectName,");
		sql.append(" obj.DESCRIPTION AS description,");
		sql.append(" obj.OBJECT_TYPE_ID AS objectTypeId,");
		sql.append(" obj.OBJECT_CODE AS objectCode,");
		sql.append(" obj.CREATE_USER AS createUser,");
		sql.append(" obj.CREATE_DATE AS createDate,");
		sql.append(" o2.OBJECT_NAME AS parentName ");
		sql.append(" FROM objects AS obj left join objects o2 on obj.PARENT_ID = o2.OBJECT_ID ");
		sql.append(" WHERE upper(obj.OBJECT_ID) = upper(:objectId)  ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("objectId", new LongType());
		query.addScalar("parentId", new LongType());
		query.addScalar("status", new LongType());
		query.addScalar("ord", new LongType());
		query.addScalar("objectUrl", new StringType());
		query.addScalar("objectName", new StringType());
		query.addScalar("description", new StringType());
		query.addScalar("objectTypeId", new LongType());
		query.addScalar("objectCode", new StringType());
		query.addScalar("createUser", new StringType());
		query.addScalar("createDate", new DateType());
		query.addScalar("parentName", new StringType());

		query.setResultTransformer(Transformers.aliasToBean(ObjectsDTO.class));

		query.setParameter("objectId", objectId);

		return (ObjectsDTO) query.uniqueResult();
	}
	
	/// lay ra ten chuc nang cha
	@SuppressWarnings("unchecked")
	public List<ObjectsDTO> getParent() {
		StringBuilder sql = new StringBuilder("SELECT distinct " + "	o2.OBJECT_NAME as parentName, "
				+ " o1.PARENT_ID parentId " + " FROM objects o1 left join objects o2 on o1.PARENT_ID = o2.OBJECT_ID ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("parentName", new StringType());
		query.addScalar("parentId", new LongType());

		query.setResultTransformer(Transformers.aliasToBean(ObjectsDTO.class));

		return query.list();
	}

	/// kiểm tra id trươc khi xoa
	public boolean isCheckDelObject(long id) {
		StringBuilder sql = new StringBuilder("SELECT " + " role_object.OBJECT_ID  object "

				+ " from ROLE_OBJECT  where role_object.OBJECT_ID=:objectId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("object", new LongType());

		query.setParameter("objectId", id);
		List<Object[]> list = query.list();
		if (list.size() == 0) {
			return false;
		}

		return true;
	}

	/// xóa chức năng
	@Transactional
	public String removeObject(ObjectsDTO obj) {

		Session session = getSession();
		Objects o = new Objects();
		o.setObjectId(obj.getObjectId());

		session.delete(o);

		return String.valueOf(obj.getObjectId());

	}

	
	//// khoa chuc nang
	public String LockObject(Long objectId) {
		StringBuilder sql = new StringBuilder("UPDATE objects SET STATUS=0 WHERE OBJECT_ID=:objectId");

		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.setParameter("objectId", objectId);

		return query.executeUpdate() + "";
	}

	
	/// mo khoa chuc nang
	public void unlockObject(Long objectId) {
		StringBuilder sql = new StringBuilder("UPDATE objects SET STATUS=1 WHERE OBJECT_ID=:objectId ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.setParameter("objectId", objectId);

		query.executeUpdate();

	}
	
	
	/// check truoc khi them moi va cap nhat
	public boolean isCheckAddObject(String code, Long id) {
		StringBuilder sql = new StringBuilder("SELECT " + " objects.OBJECT_CODE  objectCode "

				+ " from OBJECTS where objects.OBJECT_CODE= :code ");
		if (id != null) {
			sql.append(" AND objects.OBJECT_ID <> :id ");
		}

		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("objectCode", new StringType());

		query.setParameter("code", code);
		if (id != null) {
			query.setParameter("id", id);
		}

		List<ObjectsDTO> list = query.list();
		if (list.size() == 0) {
			return false;
		}

		return true;
	}

	
	/// them moi chuc nang
	@Transactional
	public String addObject(ObjectsDTO obj) {

		Session session = getSession();
		Objects o = new Objects();
		o.setObjectCode(obj.getObjectCode());
		o.setObjectName(obj.getObjectName());
		o.setObjectTypeId(obj.getObjectTypeId());
		o.setObjectUrl(obj.getObjectUrl());
		o.setParentId(obj.getParentId());
		o.setDescription(obj.getDescription());
		o.setStatus(obj.getStatus());
		o.setOrd(obj.getOrd());

		long objectId = (long) session.save(o);

		return String.valueOf(objectId);

	}

	
	/// cap nhat chuc nang
	@Transactional
	public long updateObject(ObjectsDTO obj) {

		Session session = getSession();
		Objects o = new Objects();
		o.setObjectCode(obj.getObjectCode());
		o.setObjectName(obj.getObjectName());
		o.setObjectTypeId(obj.getObjectTypeId());
		o.setObjectUrl(obj.getObjectUrl());
		o.setParentId(obj.getParentId());
		o.setDescription(obj.getDescription());
		o.setStatus(obj.getStatus());
		o.setOrd(obj.getOrd());
		o.setObjectId(obj.getObjectId());

		session.update(o);

		return obj.getObjectId();

	}

}
