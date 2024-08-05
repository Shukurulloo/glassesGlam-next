import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
// import member from '../../../pages/member';

interface TopAgentProps {
	agent: Member;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<img src={agentImage} alt="" />

				<strong>{agent?.memberNick}</strong>
				<span>{agent?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card">
				<img className="agent-img" src={agentImage} alt="" />
				<h2>{agent?.memberNick}</h2>
				<div  className="agent-info">
				<Stack className="agent-properties">
				<img  src="/img/icons/glasses-icon.svg" alt="" />
				<p >{agent?.memberProperties}</p>
					</Stack >
				<span>{agent?.memberType}</span>
				</div>
		
				

			</Stack>
		);
	}
};

export default TopAgentCard;
