/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  NTDS_COLOR_ASSUMED_FRIEND,
  NTDS_COLOR_FRIEND,
  NTDS_COLOR_HOSTILE,
  NTDS_COLOR_NEUTRAL,
  NTDS_COLOR_PENDING,
  NTDS_COLOR_SUSPECT,
  NTDS_COLOR_UNKNOWN,
  SvgAirBaseFriend,
  SvgAirBaseHostile,
  SvgAirBaseUnknown,
  SvgAirFriend,
  SvgAirGroupFriend,
  SvgAirGroupHostile,
  SvgAirGroupUnknown,
  SvgAirHostile,
  SvgAirUnknown,
  SvgBaseFriend,
  SvgBaseHostile,
  SvgBaseUnknown,
  SvgCarrierFriend,
  SvgCarrierHostile,
  SvgCarrierUnknown,
  SvgCommunications,
  SvgHelicopterFriend,
  SvgHelicopterHostile,
  SvgHelicopterUnknown,
  SvgLandFriend,
  SvgLandHostile,
  SvgLandUnknown,
  SvgMineField,
  SvgMissileFriend,
  SvgMissileHostile,
  SvgMissileUnknown,
  SvgPol,
  SvgPort,
  SvgRunway,
  SvgSam,
  SvgStructure,
  SvgSubGroupFriend,
  SvgSubGroupHostile,
  SvgSubGroupUnknown,
  SvgSubSurfaceFriend,
  SvgSubSurfaceHostile,
  SvgSubSurfaceUnknown,
  SvgSurfaceFriend,
  SvgSurfaceGroupFriend,
  SvgSurfaceGroupHostile,
  SvgSurfaceGroupUnknown,
  SvgSurfaceHostile,
  SvgSurfaceUnknown,
  SvgTarget,
  SvgTorpedoFriend,
  SvgTorpedoHostile,
  SvgTorpedoUnknown,
} from '../src';

export const ntdsColorIconCatalog = {
  'surface-vehicles': {
    description: 'NTDS color icons for surface vehicles',
    icons: [
      {
        name: 'surface-hostile',
        icon: <SvgSurfaceHostile fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'surface-friend',
        icon: <SvgSurfaceFriend fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'surface-unknown',
        icon: <SvgSurfaceUnknown fill={NTDS_COLOR_UNKNOWN} />,
      },
      {
        name: 'surface-neutral',
        icon: <SvgSurfaceUnknown fill={NTDS_COLOR_NEUTRAL} />,
      },
      {
        name: 'surface-pending',
        icon: <SvgSurfaceUnknown fill={NTDS_COLOR_PENDING} />,
      },
      {
        name: 'surface-assumed-friend',
        icon: <SvgSurfaceFriend fill={NTDS_COLOR_ASSUMED_FRIEND} />,
      },
      {
        name: 'surface-suspect',
        icon: <SvgSurfaceUnknown fill={NTDS_COLOR_SUSPECT} />,
      },
    ],
  },

  bases: {
    description: 'NTDS color icons for bases',
    icons: [
      {
        name: 'base-hostile',
        icon: <SvgBaseHostile fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'base-friend',
        icon: <SvgBaseFriend fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'base-unknown',
        icon: <SvgBaseUnknown fill={NTDS_COLOR_UNKNOWN} />,
      },
    ],
  },

  'land-vehicles': {
    description: 'NTDS color icons for land vehicles',
    icons: [
      {
        name: 'land-hostile',
        icon: <SvgLandHostile fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'land-friend',
        icon: <SvgLandFriend fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'land-unknown',
        icon: <SvgLandUnknown fill={NTDS_COLOR_UNKNOWN} />,
      },
      {
        name: 'land-neutral',
        icon: <SvgLandUnknown fill={NTDS_COLOR_NEUTRAL} />,
      },
      {
        name: 'land-pending',
        icon: <SvgLandUnknown fill={NTDS_COLOR_PENDING} />,
      },
      {
        name: 'land-assumed-friend',
        icon: <SvgLandFriend fill={NTDS_COLOR_ASSUMED_FRIEND} />,
      },
      {
        name: 'land-suspect',
        icon: <SvgLandUnknown fill={NTDS_COLOR_SUSPECT} />,
      },
    ],
  },

  'carrier-vehicles': {
    description: 'NTDS color icons for carrier vehicles',
    icons: [
      {
        name: 'carrier-hostile',
        icon: <SvgCarrierHostile fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'carrier-friend',
        icon: <SvgCarrierFriend fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'carrier-unknown',
        icon: <SvgCarrierUnknown fill={NTDS_COLOR_UNKNOWN} />,
      },
    ],
  },

  'surface-groups': {
    description: 'NTDS color icons for surface groups',
    icons: [
      {
        name: 'surface-group-hostile',
        icon: <SvgSurfaceGroupHostile fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'surface-group-friend',
        icon: <SvgSurfaceGroupFriend fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'surface-group-unknown',
        icon: <SvgSurfaceGroupUnknown fill={NTDS_COLOR_UNKNOWN} />,
      },
    ],
  },

  'sub-surface-vehicles': {
    description: 'NTDS color icons for sub-surface vehicles',
    icons: [
      {
        name: 'sub-surface-hostile',
        icon: <SvgSubSurfaceHostile fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'sub-surface-friend',
        icon: <SvgSubSurfaceFriend fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'sub-surface-unknown',
        icon: <SvgSubSurfaceUnknown fill={NTDS_COLOR_UNKNOWN} />,
      },
      {
        name: 'sub-surface-neutral',
        icon: <SvgSubSurfaceUnknown fill={NTDS_COLOR_NEUTRAL} />,
      },
      {
        name: 'sub-surface-pending',
        icon: <SvgSubSurfaceUnknown fill={NTDS_COLOR_PENDING} />,
      },
      {
        name: 'sub-surface-assumed-friend',
        icon: <SvgSubSurfaceFriend fill={NTDS_COLOR_ASSUMED_FRIEND} />,
      },
      {
        name: 'sub-surface-suspect',
        icon: <SvgSubSurfaceUnknown fill={NTDS_COLOR_SUSPECT} />,
      },
    ],
  },

  'sub-surface-groups': {
    description: 'NTDS color icons for sub-surface groups',
    icons: [
      {
        name: 'sub-group-hostile',
        icon: <SvgSubGroupHostile fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'sub-group-friend',
        icon: <SvgSubGroupFriend fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'sub-group-unknown',
        icon: <SvgSubGroupUnknown fill={NTDS_COLOR_UNKNOWN} />,
      },
    ],
  },

  'air-vehicles': {
    description: 'NTDS color icons for air vehicles',
    icons: [
      {
        name: 'air-hostile',
        icon: <SvgAirHostile fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'air-friend',
        icon: <SvgAirFriend fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'air-unknown',
        icon: <SvgAirUnknown fill={NTDS_COLOR_UNKNOWN} />,
      },
      {
        name: 'air-neutral',
        icon: <SvgAirUnknown fill={NTDS_COLOR_NEUTRAL} />,
      },
      {
        name: 'air-pending',
        icon: <SvgAirUnknown fill={NTDS_COLOR_PENDING} />,
      },
      {
        name: 'air-assumed-friend',
        icon: <SvgAirFriend fill={NTDS_COLOR_ASSUMED_FRIEND} />,
      },
      {
        name: 'air-suspect',
        icon: <SvgAirUnknown fill={NTDS_COLOR_SUSPECT} />,
      },
    ],
  },

  'air-bases': {
    description: 'NTDS color icons for air bases',
    icons: [
      {
        name: 'air-base-hostile',
        icon: <SvgAirBaseHostile fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'air-base-friend',
        icon: <SvgAirBaseFriend fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'air-base-unknown',
        icon: <SvgAirBaseUnknown fill={NTDS_COLOR_UNKNOWN} />,
      },
    ],
  },

  'air-groups': {
    description: 'NTDS color icons for air groups',
    icons: [
      {
        name: 'air-group-hostile',
        icon: <SvgAirGroupHostile fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'air-group-friend',
        icon: <SvgAirGroupFriend fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'air-group-unknown',
        icon: <SvgAirGroupUnknown fill={NTDS_COLOR_UNKNOWN} />,
      },
    ],
  },

  'helicopter-vehicles': {
    description: 'NTDS color icons for helicopter vehicles',
    icons: [
      {
        name: 'helicopter-hostile',
        icon: <SvgHelicopterHostile fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'helicopter-friend',
        icon: <SvgHelicopterFriend fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'helicopter-unknown',
        icon: <SvgHelicopterUnknown fill={NTDS_COLOR_UNKNOWN} />,
      },
    ],
  },

  missiles: {
    description: 'NTDS color icons for missiles',
    icons: [
      {
        name: 'missile-hostile',
        icon: <SvgMissileHostile fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'missile-friend',
        icon: <SvgMissileFriend fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'missile-unknown',
        icon: <SvgMissileUnknown fill={NTDS_COLOR_UNKNOWN} />,
      },
    ],
  },

  torpedoes: {
    description: 'NTDS color icons for torpedoes',
    icons: [
      {
        name: 'torpedo-hostile',
        icon: <SvgTorpedoHostile fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'torpedo-friend',
        icon: <SvgTorpedoFriend fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'torpedo-unknown',
        icon: <SvgTorpedoUnknown fill={NTDS_COLOR_UNKNOWN} />,
      },
    ],
  },

  'surface-to-air-missiles': {
    description: 'NTDS color icons for surface-to-air missiles (SAM)',
    icons: [
      {
        name: 'sam-hostile',
        icon: <SvgSam fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'sam-friend',
        icon: <SvgSam fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'sam-unknown',
        icon: <SvgSam fill={NTDS_COLOR_UNKNOWN} />,
      },
      {
        name: 'sam-neutral',
        icon: <SvgSam fill={NTDS_COLOR_NEUTRAL} />,
      },
      {
        name: 'sam-pending',
        icon: <SvgSam fill={NTDS_COLOR_PENDING} />,
      },
      {
        name: 'sam-assumed-friend',
        icon: <SvgSam fill={NTDS_COLOR_ASSUMED_FRIEND} />,
      },
      {
        name: 'sam-suspect',
        icon: <SvgSam fill={NTDS_COLOR_SUSPECT} />,
      },
    ],
  },

  'communications-stations': {
    description: 'NTDS color icons for communication stations',
    icons: [
      {
        name: 'communications-hostile',
        icon: <SvgCommunications fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'communications-friend',
        icon: <SvgCommunications fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'communications-unknown',
        icon: <SvgCommunications fill={NTDS_COLOR_UNKNOWN} />,
      },
      {
        name: 'communications-neutral',
        icon: <SvgCommunications fill={NTDS_COLOR_NEUTRAL} />,
      },
      {
        name: 'communications-pending',
        icon: <SvgCommunications fill={NTDS_COLOR_PENDING} />,
      },
      {
        name: 'communications-assumed-friend',
        icon: <SvgCommunications fill={NTDS_COLOR_ASSUMED_FRIEND} />,
      },
      {
        name: 'communications-suspect',
        icon: <SvgCommunications fill={NTDS_COLOR_SUSPECT} />,
      },
    ],
  },

  'mine-fields': {
    description: 'NTDS color icons for mine fields',
    icons: [
      {
        name: 'mine-field-hostile',
        icon: <SvgMineField fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'mine-field-friend',
        icon: <SvgMineField fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'mine-field-unknown',
        icon: <SvgMineField fill={NTDS_COLOR_UNKNOWN} />,
      },
      {
        name: 'mine-field-neutral',
        icon: <SvgMineField fill={NTDS_COLOR_NEUTRAL} />,
      },
      {
        name: 'mine-field-pending',
        icon: <SvgMineField fill={NTDS_COLOR_PENDING} />,
      },
      {
        name: 'mine-field-assumed-friend',
        icon: <SvgMineField fill={NTDS_COLOR_ASSUMED_FRIEND} />,
      },
      {
        name: 'mine-field-suspect',
        icon: <SvgMineField fill={NTDS_COLOR_SUSPECT} />,
      },
    ],
  },

  'petroleum-oil-and-lubricants': {
    description: 'NTDS color icons for petroleum, oil, and lubricants (fuel)',
    icons: [
      {
        name: 'pol-hostile',
        icon: <SvgPol fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'pol-friend',
        icon: <SvgPol fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'pol-unknown',
        icon: <SvgPol fill={NTDS_COLOR_UNKNOWN} />,
      },
      {
        name: 'pol-neutral',
        icon: <SvgPol fill={NTDS_COLOR_NEUTRAL} />,
      },
      {
        name: 'pol-pending',
        icon: <SvgPol fill={NTDS_COLOR_PENDING} />,
      },
      {
        name: 'pol-assumed-friend',
        icon: <SvgPol fill={NTDS_COLOR_ASSUMED_FRIEND} />,
      },
      {
        name: 'pol-suspect',
        icon: <SvgPol fill={NTDS_COLOR_SUSPECT} />,
      },
    ],
  },

  ports: {
    description: 'NTDS color icons for ports',
    icons: [
      {
        name: 'port-hostile',
        icon: <SvgPort fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'port-friend',
        icon: <SvgPort fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'port-unknown',
        icon: <SvgPort fill={NTDS_COLOR_UNKNOWN} />,
      },
      {
        name: 'port-neutral',
        icon: <SvgPort fill={NTDS_COLOR_NEUTRAL} />,
      },
      {
        name: 'port-pending',
        icon: <SvgPort fill={NTDS_COLOR_PENDING} />,
      },
      {
        name: 'port-assumed-friend',
        icon: <SvgPort fill={NTDS_COLOR_ASSUMED_FRIEND} />,
      },
      {
        name: 'port-suspect',
        icon: <SvgPort fill={NTDS_COLOR_SUSPECT} />,
      },
    ],
  },

  runways: {
    description: 'NTDS color icons for runways',
    icons: [
      {
        name: 'runway-hostile',
        icon: <SvgRunway fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'runway-friend',
        icon: <SvgRunway fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'runway-unknown',
        icon: <SvgRunway fill={NTDS_COLOR_UNKNOWN} />,
      },
      {
        name: 'runway-neutral',
        icon: <SvgRunway fill={NTDS_COLOR_NEUTRAL} />,
      },
      {
        name: 'runway-pending',
        icon: <SvgRunway fill={NTDS_COLOR_PENDING} />,
      },
      {
        name: 'runway-assumed-friend',
        icon: <SvgRunway fill={NTDS_COLOR_ASSUMED_FRIEND} />,
      },
      {
        name: 'runway-suspect',
        icon: <SvgRunway fill={NTDS_COLOR_SUSPECT} />,
      },
    ],
  },

  structures: {
    description: 'NTDS color icons for structures',
    icons: [
      {
        name: 'structure-hostile',
        icon: <SvgStructure fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'structure-friend',
        icon: <SvgStructure fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'structure-unknown',
        icon: <SvgStructure fill={NTDS_COLOR_UNKNOWN} />,
      },
      {
        name: 'structure-neutral',
        icon: <SvgStructure fill={NTDS_COLOR_NEUTRAL} />,
      },
      {
        name: 'structure-pending',
        icon: <SvgStructure fill={NTDS_COLOR_PENDING} />,
      },
      {
        name: 'structure-assumed-friend',
        icon: <SvgStructure fill={NTDS_COLOR_ASSUMED_FRIEND} />,
      },
      {
        name: 'structure-suspect',
        icon: <SvgStructure fill={NTDS_COLOR_SUSPECT} />,
      },
    ],
  },
  targets: {
    description: 'NTDS color icons for targets',
    icons: [
      {
        name: 'target-hostile',
        icon: <SvgTarget fill={NTDS_COLOR_HOSTILE} />,
      },
      {
        name: 'target-friend',
        icon: <SvgTarget fill={NTDS_COLOR_FRIEND} />,
      },
      {
        name: 'target-unknown',
        icon: <SvgTarget fill={NTDS_COLOR_UNKNOWN} />,
      },
      {
        name: 'target-neutral',
        icon: <SvgTarget fill={NTDS_COLOR_NEUTRAL} />,
      },
      {
        name: 'target-pending',
        icon: <SvgTarget fill={NTDS_COLOR_PENDING} />,
      },
      {
        name: 'target-assumed-friend',
        icon: <SvgTarget fill={NTDS_COLOR_ASSUMED_FRIEND} />,
      },
      {
        name: 'target-suspect',
        icon: <SvgTarget fill={NTDS_COLOR_SUSPECT} />,
      },
    ],
  },
};
