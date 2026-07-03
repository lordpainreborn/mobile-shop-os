"use server";

import { revalidatePath } from 'next/cache';
import { Prisma, RepairStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type CreateRepairTicketInput = {
  customerName: string;
  customerPhone: string;
  deviceModel: string;
  issueDescription: string;
  estimateCost?: number;
};

const VALID_REPAIR_STATUSES: RepairStatus[] = [
  'PENDING',
  'CHECKING',
  'REPAIRING',
  'READY',
  'DELIVERED',
];

const isValidRepairStatus = (value: string): value is RepairStatus =>
  VALID_REPAIR_STATUSES.includes(value as RepairStatus);

export async function getRepairTickets(
  search?: string,
  status?: string
): Promise<ActionResponse<Prisma.RepairTicketGetPayload<{}>[]>> {
  try {
    const where: Prisma.RepairTicketWhereInput = {};

    if (status && isValidRepairStatus(status)) {
      where.status = status;
    }

    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      where.OR = [
        { customerName: { contains: trimmedSearch, mode: 'insensitive' } },
        { customerPhone: { contains: trimmedSearch, mode: 'insensitive' } },
        { deviceModel: { contains: trimmedSearch, mode: 'insensitive' } },
        { issueDescription: { contains: trimmedSearch, mode: 'insensitive' } },
      ];
    }

    const tickets = await prisma.repairTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: tickets };
  } catch (error) {
    console.error('[getRepairTickets]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch repair tickets',
    };
  }
}

export async function createRepairTicket(
  data: CreateRepairTicketInput
): Promise<ActionResponse<Prisma.RepairTicketGetPayload<{}>>> {
  try {
    if (!data.customerName.trim()) {
      return { success: false, error: 'Customer name is required' };
    }

    if (!data.customerPhone.trim()) {
      return { success: false, error: 'Customer phone is required' };
    }

    if (!data.deviceModel.trim()) {
      return { success: false, error: 'Device model is required' };
    }

    if (!data.issueDescription.trim()) {
      return { success: false, error: 'Issue description is required' };
    }

    if (data.estimateCost != null && data.estimateCost < 0) {
      return { success: false, error: 'Estimate cost must be non-negative' };
    }

    const ticket = await prisma.repairTicket.create({
      data: {
        customerName: data.customerName.trim(),
        customerPhone: data.customerPhone.trim(),
        deviceModel: data.deviceModel.trim(),
        issueDescription: data.issueDescription.trim(),
        estimateCost: data.estimateCost ?? null,
        status: 'PENDING',
      },
    });

    revalidatePath('/repairs');

    return { success: true, data: ticket };
  } catch (error) {
    console.error('[createRepairTicket]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create repair ticket',
    };
  }
}

export async function updateRepairStatus(
  id: string,
  status: 'PENDING' | 'CHECKING' | 'REPAIRING' | 'READY' | 'DELIVERED'
): Promise<ActionResponse<Prisma.RepairTicketGetPayload<{}>>> {
  try {
    if (!id.trim()) {
      return { success: false, error: 'Repair ticket ID is required' };
    }

    if (!isValidRepairStatus(status)) {
      return { success: false, error: 'Invalid repair status' };
    }

    const ticket = await prisma.repairTicket.update({
      where: { id },
      data: { status },
    });

    revalidatePath('/repairs');

    return { success: true, data: ticket };
  } catch (error) {
    console.error('[updateRepairStatus]', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return { success: false, error: 'Repair ticket not found' };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update repair status',
    };
  }
}
