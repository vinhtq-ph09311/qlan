package com.viettel.qlan.dao;

import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import com.viettel.qlan.bo.ApParam;
import com.viettel.qlan.dto.ApParamDTO;
import com.viettel.service.base.dao.BaseFWDAOImpl;

@Repository("apParamDAO")
public class ApParamDAO extends BaseFWDAOImpl<ApParam, Long> {

	public List<ApParamDTO> getListWaning(){
			StringBuilder sql = new StringBuilder(
					"SELECT ap_param.AP_PARAM_ID AS apParamId, "
				+ "ap_param.CODE AS code, "
				+ "ap_param.NAME AS name, "
				+ "ap_param.VALUE AS value, "
				+ "ap_param.STATUS AS status "
				+ "FROM ap_param "
				+ "WHERE ap_param.`STATUS` = 1 "
				+ " AND ap_param.TYPE = 'WL'"
					);
			
			sql.append("ORDER BY ap_param.NAME,ap_param.CODE");
			
			SQLQuery query = getSession().createSQLQuery( sql.toString() );
			query.addScalar( "apParamId", new LongType() );
			query.addScalar( "code", new StringType() );
			query.addScalar( "name", new StringType() );
			query.addScalar( "value", new StringType() );
			query.addScalar( "status", new LongType() );
			
			query.setResultTransformer( Transformers.aliasToBean( ApParamDTO.class ) );
			
			return query.list();
		}
	
	public ApParamDTO getWLByValue(Long warningLevel){
		StringBuilder sql = new StringBuilder(
				"SELECT ap_param.AP_PARAM_ID AS apParamId, "
			+ "ap_param.CODE AS code, "
			+ "ap_param.NAME AS name, "
			+ "ap_param.VALUE AS value, "
			+ "ap_param.STATUS AS status "
			+ "FROM ap_param "
			+ "WHERE ap_param.`STATUS` = 1 "
			+ " AND ap_param.TYPE = 'WL' "
				);
		if(warningLevel != null) {
			sql.append("AND ap_param.VALUE = :warningLevel ");
		}
		sql.append("ORDER BY ap_param.NAME,ap_param.CODE");
		
		SQLQuery query = getSession().createSQLQuery( sql.toString() );
		query.addScalar( "apParamId", new LongType() );
		query.addScalar( "code", new StringType() );
		query.addScalar( "name", new StringType() );
		query.addScalar( "value", new StringType() );
		query.addScalar( "status", new LongType() );
		
		if(warningLevel != null) {
			query.setParameter("warningLevel", warningLevel);
		}
		
		query.setResultTransformer( Transformers.aliasToBean( ApParamDTO.class ) );
		
		ApParamDTO dto  = (ApParamDTO) query.uniqueResult();

		return dto;
	}
	


}
