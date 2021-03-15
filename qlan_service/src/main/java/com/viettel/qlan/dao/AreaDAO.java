package com.viettel.qlan.dao;

import java.math.BigInteger;
import java.util.Iterator;
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
import com.viettel.qlan.dto.AreaDTO;
import com.viettel.qlan.dto.DeptDTO;
import com.viettel.qlan.utils.ValidateUtils;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@Repository("areaDAO")
public class AreaDAO extends BaseFWDAOImpl<Area, Long> {

	public AreaDAO() {
		this.model = new Area();
	}

	public AreaDAO(Session session) {
		this.session = session;
	}
	
	// Lấy ra cây đơn vị
	@SuppressWarnings("unchecked") // ko kiem tra
	public List<AreaDTO> getTree(){
		StringBuilder sql = new StringBuilder("SELECT "
				+ "area.ID id, area.PARENT_ID parentId, "
				+ "area.AREA_CODE areaCode, "
				+ "area.AREA_NAME areaName, "
				+ "area.`STATUS` `status`, "
				+ "area.PATH path  FROM area WHERE area.`STATUS` = 1 ");
		sql.append("ORDER BY area.AREA_CODE asc ");		

		SQLQuery query = getSession().createSQLQuery(sql.toString());		
		
		// Khai báo kết quả truy vấn bằng addScalar
		query.addScalar("id", new LongType());
		query.addScalar("parentId", new LongType());
		query.addScalar("areaCode", new StringType());
		query.addScalar("areaName", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("path", new StringType());

		// Xử lý và trả về kết quả truy vấn
		query.setResultTransformer(Transformers.aliasToBean(AreaDTO.class));
		
		return query.list();
		
	}

	// lấy danh sách đơn vị cha
	@SuppressWarnings("unchecked")
	public List<AreaDTO> doSearch(AreaDTO obj) {
		StringBuilder sql = new StringBuilder("SELECT "
				+ "				   a.ID id, "
				+ "				   a.PARENT_ID 	parentId, "
				+ "				   a.AREA_CODE 	areaCode, "
				+ "				   a.AREA_NAME 	areaName, "
				+ "				   a.`STATUS` 	`status`,  "
				+ "				   a.PATH 		path, "
				+ "				   b.AREA_NAME 		parentName "
				+ "				   FROM area a LEFT JOIN area b on a.PARENT_ID = b.ID  "
				+ "				   WHERE 1=1  ");
		
		
		// chuỗi khác null và length khác 0
		// escape kiểm tra một số ký tự đặc biệt như &, %, _, ^; phân biệt các ký tự đặc biệt
		
		// Tìm kiếm theo mã đơn vị
		if (!StringUtils.isEmpty(obj.getAreaCode())) {
			sql.append("AND  upper(a.AREA_CODE) LIKE upper(:areaCode) escape '&'  ");
		}
		
		// Tìm kiếm theo tên đơn vị
		if (!StringUtils.isEmpty(obj.getAreaName())) {
			sql.append("AND  upper(a.AREA_NAME) LIKE upper(:areaName) escape '&'  ");
		}
		
		
		if (obj.getStatus() != null) {
			sql.append("AND  a.`STATUS` = :status ");
		}
		
		// Tìm theo cây đơn vị (id) -- click vào cây đơn vị 
		if (obj.getId() != null) {
			sql.append("AND a.ID =:id ");
		}
		
		// Lấy đơn vị đầu tiên trong cây đơn vị đổ thông tin vào bảng “Đơn vị cha”
		if (obj.getListId() != null && obj.getListId().size() > 0) {
			String listId = String.join(",", obj.getListId());
			sql.append("AND a.ID in ("+listId+") ");
		}
		
		
		sql.append("ORDER BY a.AREA_CODE asc ");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM ( ");
		sqlCount.append(sql.toString());
		sqlCount.append(" ) as objects; ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("id", new LongType());
		query.addScalar("parentId", new LongType());
		query.addScalar("areaCode", new StringType());
		query.addScalar("areaName", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("parentName", new StringType());
		query.addScalar("path", new StringType());

		// thực hiện truy vấn - mapping với các thuộc tính trong DTO
		query.setResultTransformer(Transformers.aliasToBean(AreaDTO.class));
		
		// escape kiểm tra một số ký tự đặc biệt như &, %, _, ^ - sql injection
		// trim() loại bỏ khoảng trắng
		
		
		if (!StringUtils.isEmpty(obj.getAreaCode())) {
			query.setParameter("areaCode","%"+ValidateUtils.validateKeySearch(obj.getAreaCode().trim())+"%");
			queryCount.setParameter("areaCode","%"+ValidateUtils.validateKeySearch(obj.getAreaCode().trim())+"%");
		}
		
		
		if (!StringUtils.isEmpty(obj.getAreaName())) {
			query.setParameter("areaName","%"+ValidateUtils.validateKeySearch(obj.getAreaName().trim())+"%");
			queryCount.setParameter("areaName","%"+ValidateUtils.validateKeySearch(obj.getAreaName().trim())+"%");
		}
		
		if (obj.getStatus() != null) {
			query.setParameter("status", obj.getStatus());
			queryCount.setParameter("status", obj.getStatus());
		}
		
		if (obj.getId() != null) {
			query.setParameter("id", obj.getId());
			queryCount.setParameter("id", obj.getId());
		}
		
		
		// Phan trang
		query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
		query.setMaxResults(obj.getPageSize().intValue());
		obj.setTotalRecord(((BigInteger) queryCount.uniqueResult()).intValue());

		return query.list();
	}
	
	// Lấy danh sách đơn vị trực thuộc
	@SuppressWarnings("unchecked")
	public List<AreaDTO> doSearchChildren(AreaDTO obj) {
		StringBuilder sql = new StringBuilder("SELECT "
				+ "				   area.ID id, "
				+ "				   area.PARENT_ID 	parentId, "
				+ "				   area.AREA_CODE 	areaCode, "
				+ "				   area.AREA_NAME 	areaName, "
				+ "				   area.`STATUS` 	`status`,  "
				+ "				   area.PATH 		path, "
				+ "				   b.AREA_NAME 		parentName "
				+ "				   FROM area LEFT JOIN area b on area.PARENT_ID = b.ID  "
				+ "				   WHERE area.`STATUS` = 1  ");
		
		// parentId = id của đơn vị cha
		
		if (obj.getId() != null) {
			sql.append("AND area.PARENT_ID = :parentId ");
		}
		
		sql.append("ORDER BY area.AREA_CODE asc ");
		StringBuilder sqlCount = new StringBuilder("SELECT COUNT(*) FROM ( ");
		sqlCount.append(sql.toString());
		sqlCount.append(" ) as objects; ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		SQLQuery queryCount = getSession().createSQLQuery(sqlCount.toString());

		query.addScalar("id", new LongType());
		query.addScalar("parentId", new LongType());
		query.addScalar("areaCode", new StringType());
		query.addScalar("areaName", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("parentName", new StringType());
		query.addScalar("path", new StringType());

		// tra ra ket qua truy van
		query.setResultTransformer(Transformers.aliasToBean(AreaDTO.class));
		
		
		if (obj.getId() != null) {
			query.setParameter("parentId",obj.getId());
			queryCount.setParameter("parentId", obj.getId());
		}
		
		// Phan trang
		query.setFirstResult((obj.getPage().intValue() - 1) * obj.getPageSize().intValue());
		query.setMaxResults(obj.getPageSize().intValue());
		obj.setTotalRecord(((BigInteger) queryCount.uniqueResult()).intValue());

		return query.list();
	}
	
	
	// Tìm kiếm đơn vị theo id
	public AreaDTO getAreaById(Long id) {
		StringBuilder sql = new StringBuilder("SELECT "
				+ "area.ID id, "
				+ "area.PARENT_ID parentId, "
				+ "area.AREA_CODE areaCode, "
				+ "area.AREA_NAME areaName, "
				+ "area.`STATUS` `status`, "
				+ "area.PATH path  "
				+ "FROM area "
				+ "WHERE  area.ID =:id ");
		
		sql.append("ORDER BY area.AREA_CODE asc ");		

		SQLQuery query = getSession().createSQLQuery(sql.toString());		

		query.addScalar("id", new LongType());
		query.addScalar("parentId", new LongType());
		query.addScalar("areaCode", new StringType());
		query.addScalar("areaName", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("path", new StringType());
		
		query.setResultTransformer(Transformers.aliasToBean(AreaDTO.class));
		
		query.setParameter("id", id);
		
		
		return (AreaDTO) query.uniqueResult();
	}
	
	// Tìm kiếm theo mã đơn vị
	public AreaDTO getAreaByAreaCode(String areaCode) {
		StringBuilder sql = new StringBuilder("SELECT "
				+ "area.ID id, "
				+ "area.PARENT_ID parentId, "
				+ "area.AREA_CODE areaCode, "
				+ "area.AREA_NAME areaName, "
				+ "area.`STATUS` `status`, "
				+ "area.PATH path  "
				+ "FROM area "
				+ "WHERE  upper(area.AREA_CODE) = upper(:areaCode) ");
		
		sql.append("ORDER BY area.AREA_CODE asc ");		

		SQLQuery query = getSession().createSQLQuery(sql.toString());		

		query.addScalar("id", new LongType());
		query.addScalar("parentId", new LongType());
		query.addScalar("areaCode", new StringType());
		query.addScalar("areaName", new StringType()); 
		query.addScalar("status", new LongType());
		query.addScalar("path", new StringType());
		
		query.setResultTransformer(Transformers.aliasToBean(AreaDTO.class));
		
		query.setParameter("areaCode", areaCode);
		
		return (AreaDTO) query.uniqueResult();
	}
	
	
	
	
	
	
	
	// AutoSearch
	@SuppressWarnings("unchecked")
	public List<AreaDTO> getListAreaAutoSearch(AreaDTO obj){
		StringBuilder sql = new StringBuilder("SELECT "
				+ "	area.ID id, "
				+ "	area.AREA_CODE 	areaCode, "
				+ "	area.AREA_NAME 	areaName "
				+ "	FROM area "
				+ "	WHERE 1=1 ");
		
		// Tìm theo tên và code
		if (!StringUtils.isEmpty(obj.getAreaName())) {
			sql.append("AND ( upper(area.AREA_NAME) LIKE upper(:areaName) escape '&' ");
			sql.append(" OR upper(area.AREA_CODE ) LIKE upper(:areaName)  escape '&' ) ");
		}
		
		
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		
		query.addScalar("id", new LongType());
		query.addScalar("areaCode", new StringType());
		query.addScalar("areaName", new StringType());
		
		query.setResultTransformer(Transformers.aliasToBean(AreaDTO.class));
		
		if (!StringUtils.isEmpty(obj.getAreaName())) {
			query.setParameter("areaName", "%"+ValidateUtils.validateKeySearch(obj.getAreaName().trim())+"%");
		}
		
		
		return query.list();
	}
	
	
	// Kiem tra trung lap AreaCode truoc khi Them moi
	
	public boolean checkDuplicateAreaCode(String areaCode) {
		String sql = "SELECT "
				+ "	area.ID 		id, "
				+ "	area.AREA_CODE 	areaCode "
				+ "	FROM area WHERE upper(area.AREA_CODE) =:areaCode ";
		SQLQuery query = getSession().createSQLQuery(sql);
		
		query.addScalar("id", new LongType());
		query.addScalar("areaCode", new StringType());
		
		query.setParameter("areaCode", areaCode);
		
		if (query.list().size() <= 0) {
			return true;
		}
		
		return false;
	}
	
	// Kiểm tra có trùng tên đơn vị hay không ?
	public boolean checkDuplicateAreaName(String areaName, Long id) {
		StringBuilder sql = new StringBuilder("SELECT "
				+ "				area.ID 		id, "
				+ "				area.AREA_NAME 	areaName "
				+ "				FROM area WHERE upper(area.AREA_NAME) =:areaName ");
		
		if (id != null ) {
			sql.append(" AND area.ID <> :id ");
		}
		
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		
		query.addScalar("id", new LongType());
		query.addScalar("areaName", new StringType());
			
		query.setParameter("areaName", areaName);
		
		if (id != null ) {
			query.setParameter("id",id);
		}
		
		
		if (query.list().size() <= 0) {
			return true;
		}
		
		return false;
	}
	
	// Kiểm tra đơn vị cha có tồn tại hay không ?
	public boolean checkParentExist(Long parentId, String parentName) {
		StringBuilder sql = new StringBuilder("SELECT "
				+ "				area.ID 		id, "
				+ "				area.AREA_NAME 	areaName,"
				+ "				area.PARENT_ID  parentId "
				+ "				FROM area WHERE upper(area.id) =:parentId ");
				
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		
		query.addScalar("id", new LongType());
		query.addScalar("areaName", new StringType());
		query.addScalar("parentId", new LongType());
			
		query.setParameter("parentId", parentId);
		

		if (query.list().size() <= 0 && parentName.length() > 0) {
			return true;
		}
		
		return false;
	}
	
	
	
		// Them moi don vi
	@Transactional	
	public long addArea(AreaDTO obj) {
		Session session = getSession();
		Area area = new Area();
		
		// id tự tăng - AUTO_INCREMENT
		area.setAreaName(obj.getAreaName());
		area.setAreaCode(obj.getAreaCode());
		area.setParentId(obj.getParentId());
		area.setPath(obj.getPath());
		area.setStatus(obj.getStatus());
		
		return (long) session.save(area);
		
		
	}

	
	
		// Kiểm tra đệ quy - quan hệ cha con khi update và remove
		public boolean checkDeQuyArea(AreaDTO obj) {
			
			// Tìm kiếm tất cả những thằng con, cháu theo @idCha với điều kiện parentId < id
			
			StringBuilder sqlDequy = new StringBuilder("SELECT 	"
					+ " a.ID, a.PARENT_ID parentId, a.AREA_CODE, a.AREA_NAME, a.`STATUS`, a.PATH "
					+ " FROM area a, (SELECT @idCha \\:= :parentId) dequy "
					+ " WHERE   FIND_IN_SET(a.PARENT_ID, @idCha) "
					+ " AND LENGTH(@idCha \\:= CONCAT(@idCha, ',' ,a.ID))");
			
			
			// gán lại giá trị @idCha = chuỗi concat(@idCha, ',' ,a.ID)
			// @idCha = parentId lấy theo id của đơn vị cha
			
			SQLQuery queryDequy = getSession().createSQLQuery(sqlDequy.toString());
			
			queryDequy.addScalar("parentId",new LongType());
			
			
			queryDequy.setResultTransformer( Transformers.aliasToBean( AreaDTO.class ) );
			
			queryDequy.setParameter("parentId", obj.getId());
			
			
			List<AreaDTO> listDonViCon = queryDequy.list();
			
			
			// Tìm kiếm đơn vị cha theo parentId (id = parentId) để kiếm tra xem đơn vị cha có trùng với đơn vị con cháu ở trên hay không ?
			StringBuilder sqlDonViCha = new StringBuilder("SELECT "
					+ "area.ID id, "
					+ "area.PARENT_ID parentId, "
					+ "area.AREA_CODE areaCode, "
					+ "area.AREA_NAME areaName, "
					+ "area.`STATUS` `status`, "
					+ "area.PATH path  "
					+ "FROM area "
					+ "WHERE  area.ID =:id ");
		
			SQLQuery queryDonViCha = getSession().createSQLQuery(sqlDonViCha.toString());		

			queryDonViCha.addScalar("id", new LongType());
			queryDonViCha.addScalar("parentId", new LongType());
			queryDonViCha.addScalar("areaCode", new StringType());
			queryDonViCha.addScalar("areaName", new StringType());
			queryDonViCha.addScalar("status", new LongType());
			queryDonViCha.addScalar("path", new StringType());
			
			queryDonViCha.setResultTransformer(Transformers.aliasToBean(AreaDTO.class));
			
			queryDonViCha.setParameter("id", obj.getParentId());
			
			AreaDTO areaCha = (AreaDTO) queryDonViCha.uniqueResult();
			
			if (areaCha != null  && areaCha.getParentId() > 0L) {
				for (int i = 0; i < listDonViCon.size(); i++) {
					
					// So sánh Long, Double type có thể dùng equals
					if (listDonViCon.get(i).getParentId().equals(areaCha.getParentId())) {
						return false;
					}
					
				}
				
			}
			return true;
		}
		
		
		
	// Update don vi
	@Transactional
	public long updateArea(AreaDTO obj) {
		Session session = getSession();
		Area area = new Area();
		
		area.setId(obj.getId());
		area.setAreaName(obj.getAreaName());
		area.setAreaCode(obj.getAreaCode());
		area.setParentId(obj.getParentId());
		area.setPath(obj.getPath());
		area.setStatus(obj.getStatus());
		
		session.update(area);
		
		return  area.getId();
		
		}
	
	// Trước khi xóa, kiểm tra đơn vị có còn tồn tại trong db hay không
	public boolean isCheckExistArea(long id) {
		StringBuilder sql = new StringBuilder("SELECT area.ID id FROM area WHERE area.ID =:id ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.addScalar("id", new LongType());
		query.setParameter("id", id);
		
		if (query.list().size() <= 0) {
			return false;
		}
		
		return true;
	}
	
	// Trước khi xoá , Kiểm tra đơn vị này  có đơn vị con trực thuộc hay không ?
	public boolean isCheckDelArea(long id) {
		StringBuilder sql = new StringBuilder("SELECT "
				+ "	area.ID id,  "
				+ "	area.PARENT_ID parentId	"
				+ "	FROM area WHERE upper(area.PARENT_ID) =:parentId ");
		
		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("id", new LongType());
		query.addScalar("parentId",new LongType());
	
		query.setParameter("parentId", id);
	
		if(query.list().size() <= 0) {
			return	false;
	}
		
		return true;
	}
		
	// xoa don vi
	@Transactional
	public long removeArea(AreaDTO obj) {
	
			Session session = getSession();
			Area area = new Area();
			area.setId(obj.getId());
			
			session.delete(area);
			
			return obj.getId();
	
		}
	}
