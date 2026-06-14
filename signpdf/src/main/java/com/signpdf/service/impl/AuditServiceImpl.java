package com.signpdf.service.impl;

import com.signpdf.entity.AuditLog;
import com.signpdf.entity.User;

import com.signpdf.enums.AuditAction;

import com.signpdf.repository.AuditLogRepository;

import com.signpdf.service.interfaces.AuditService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

	private final AuditLogRepository auditLogRepository;

	@Override
	public void log(AuditAction action, String description, User user, String ipAddress) {

		AuditLog auditLog = AuditLog.builder().action(action).description(description).user(user).ipAddress(ipAddress)
				.timestamp(LocalDateTime.now()).build();

		auditLogRepository.save(auditLog);
	}
}