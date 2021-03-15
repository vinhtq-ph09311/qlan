package com.viettel.qlan.utils;

import java.util.ResourceBundle;

public class QlanResource {
private static ResourceBundle config;
public static synchronized ResourceBundle getConfig(){
	if(config==null){
		config=ResourceBundle.getBundle("lang_VI", new UTF8Control());
	}
	return config;
}

public static String get(String key){
	return getConfig().getString(key);
}

public static String getDeptName(String key1, String deptName, String key2) {
	return getConfig().getString(key1) + deptName + " " + getConfig().getString(key2);
}
}
