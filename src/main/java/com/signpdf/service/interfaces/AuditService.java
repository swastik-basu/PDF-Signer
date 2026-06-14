package com.signpdf.service.interfaces;

import com.signpdf.enums.AuditAction;
import com.signpdf.entity.User;

public interface AuditService {

	void log(AuditAction action, String description, User user, String ipAddress);
}