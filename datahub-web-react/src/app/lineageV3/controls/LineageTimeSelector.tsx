import { CalendarOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Tooltip } from '@components';
import { Button, DatePicker, Space, Typography } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { REDESIGN_COLORS } from '@app/entityV2/shared/constants';

const { RangePicker } = DatePicker;

export type Datetime = moment.Moment | null;

const ConfirmButtonWrapper = styled.div`
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
`;

const ConfirmButton = styled(Button)`
    border-radius: 15px;
    border: 1px solid ${REDESIGN_COLORS.BLACK};

    position: absolute;
    right: 10px;
    bottom: 13px;
    text-align: right;

    :hover {
        border-color: ${REDESIGN_COLORS.BLUE};
        color: ${REDESIGN_COLORS.BLUE};
    }
`;

export type Props = {
    onChange: (start: Datetime, end: Datetime) => void;
    startTimeMillis?: number;
    endTimeMillis?: number;
};

export default function LineageTimeSelector({ onChange, startTimeMillis, endTimeMillis }: Props) {
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState<Datetime>(startTimeMillis ? moment(startTimeMillis) : null);
    const [endDate, setEndDate] = useState<Datetime>(endTimeMillis ? moment(endTimeMillis) : null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const ref = useRef<any>(null);

    useEffect(() => {
        setStartDate(startTimeMillis ? moment(startTimeMillis) : null);
    }, [startTimeMillis]);

    useEffect(() => {
        setEndDate(endTimeMillis ? moment(endTimeMillis) : null);
    }, [endTimeMillis]);

    const handleOpenChange = useCallback(
        (open: boolean) => {
            setIsOpen(open);
            if (!open) {
                ref.current?.blur();
                onChange(startDate, endDate);
            }
        },
        [onChange, startDate, endDate],
    );

    const handleRangeChange = useCallback((dates: [Datetime, Datetime] | null) => {
        const [start, end] = dates || [null, null];

        start?.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        end?.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });

        setStartDate(start);
        setEndDate(end);
    }, []);

    const showText = !isOpen && (startDate === null || endDate === null);

    const [ranges] = useState<Array<[Datetime, Datetime]>>([
        [moment().subtract(7, 'days'), null],
        [moment().subtract(14, 'days'), null],
        [moment().subtract(28, 'days'), null],
        [null, null],
    ]);

    return (
        <>
            {showText ? ( // Conditionally render All Time selection
                <Tooltip title={t('lineage.filterLineageByObservedDate')} placement="topLeft" showArrow={false}>
                    <Button type="text" onClick={() => handleOpenChange(true)}>
                        <CalendarOutlined style={{ marginRight: '4px' }} />
                        <Typography.Text>
                            <b>{getTimeRangeDescription(startDate, endDate, t)}</b>
                        </Typography.Text>
                        <CaretDownOutlined style={{ fontSize: '10px' }} />
                    </Button>
                </Tooltip>
            ) : (
                <Space direction="vertical" size={12}>
                    <RangePicker
                        ref={ref}
                        open={isOpen}
                        allowClear
                        allowEmpty={[true, true]}
                        bordered={false}
                        value={[startDate, endDate]}
                        disabledDate={(current: any) => {
                            return current && current > moment().endOf('day');
                        }}
                        renderExtraFooter={() => (
                            <ConfirmButtonWrapper>
                                <ConfirmButton type="text" onClick={() => handleOpenChange(false)}>
                                    <b>{t('lineage.confirm')}</b>
                                </ConfirmButton>
                            </ConfirmButtonWrapper>
                        )}
                        format="ll"
                        ranges={Object.fromEntries(
                            ranges.map(([start, end]) => [getTimeRangeDescription(start, end, t), [start, end]]),
                        )}
                        onChange={handleRangeChange}
                        onOpenChange={handleOpenChange}
                        onCalendarChange={() => handleOpenChange(true)}
                    />
                </Space>
            )}
        </>
    );
}

function getTimeRangeDescription(startDate: moment.Moment | null, endDate: moment.Moment | null, t?: any): string {
    const i18n = t || ((key: string) => key);
    if (!startDate && !endDate) {
        return i18n('lineage.allTime');
    }

    if (!startDate && endDate) {
        return i18n('lineage.until', { date: endDate.format('ll') });
    }

    if (startDate && !endDate) {
        const dayDiff = moment().diff(startDate, 'days');
        if (dayDiff <= 30) {
            return i18n('lineage.last', { count: dayDiff });
        }
        return i18n('lineage.from', { date: startDate.format('ll') });
    }

    return i18n('lineage.unknownTimeRange');
}
