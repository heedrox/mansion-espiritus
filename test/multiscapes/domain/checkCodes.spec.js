const { expect } = require('chai');
const CheckCodes = require('../../../multiscapes/domain/checkCodes');

describe('CheckCodes - Códigos por Habitación', () => {
    describe('checkCode con habitación específica', () => {
        it('should validate DOTBA code in playa-sur', function() {
            // Arrange
            const code = 'DOTBA';
            const roomName = 'playa-sur';

            // Act
            const result = CheckCodes.checkCode(code, roomName);

            // Assert
            expect(result.isValid).to.be.true;
            expect(result.code).to.equal('DOTBA');
            expect(result.effect).to.equal('Abre la barrera electromagnética');
            expect(result.stateChanges).to.deep.equal({
                barreraElectromagneticaAbierta: true
            });
            expect(result.message).to.include('DOTBA válido');
            
            console.log('✅ DOTBA code test passed for playa-sur');
        });

        it('should validate 8462 code in playa-norte', function() {
            // Arrange
            const code = '8462';
            const roomName = 'playa-norte';

            // Act
            const result = CheckCodes.checkCode(code, roomName);

            // Assert
            expect(result.isValid).to.be.true;
            expect(result.code).to.equal('8462');
            expect(result.effect).to.equal('Abre la pirámide');
            expect(result.stateChanges).to.deep.equal({
                piramideAbierta: true
            });
            expect(result.message).to.include('8462 válido');
            expect(result.message).to.include('pirámide');
            
            console.log('✅ 8462 code test passed for playa-norte');
        });

        it('should reject DOTBA code in playa-norte (wrong room)', function() {
            // Arrange
            const code = 'DOTBA';
            const roomName = 'playa-norte';

            // Act
            const result = CheckCodes.checkCode(code, roomName);

            // Assert
            expect(result.isValid).to.be.false;
            expect(result.code).to.equal('DOTBA');
            expect(result.message).to.include('no reconocido');
            
            console.log('✅ DOTBA code correctly rejected in playa-norte');
        });

        it('should reject 8462 code in playa-sur (wrong room)', function() {
            // Arrange
            const code = '8462';
            const roomName = 'playa-sur';

            // Act
            const result = CheckCodes.checkCode(code, roomName);

            // Assert
            expect(result.isValid).to.be.false;
            expect(result.code).to.equal('8462');
            expect(result.message).to.include('no reconocido');
            
            console.log('✅ 8462 code correctly rejected in playa-sur');
        });

        it('should handle invalid code in any room', function() {
            // Arrange
            const code = 'INVALID';
            const roomName = 'playa-sur';

            // Act
            const result = CheckCodes.checkCode(code, roomName);

            // Assert
            expect(result.isValid).to.be.false;
            expect(result.code).to.equal('INVALID');
            expect(result.message).to.include('no reconocido');
            
            console.log('✅ Invalid code correctly rejected');
        });

        it('should handle non-existent room with fallback to legacy codes', function() {
            // Arrange
            const code = 'DOTBA';
            const roomName = 'non-existent-room';

            // Act
            const result = CheckCodes.checkCode(code, roomName);

            // Assert
            expect(result.isValid).to.be.true;
            expect(result.code).to.equal('DOTBA');
            expect(result.effect).to.equal('Abre la barrera electromagnética');
            
            console.log('✅ Fallback to legacy codes working');
        });
    });

    describe('checkCode sin habitación (compatibilidad hacia atrás)', () => {
        it('should use legacy codes when no room specified', function() {
            // Arrange
            const code = 'DOTBA';

            // Act
            const result = CheckCodes.checkCode(code);

            // Assert
            expect(result.isValid).to.be.true;
            expect(result.code).to.equal('DOTBA');
            expect(result.effect).to.equal('Abre la barrera electromagnética');
            
            console.log('✅ Legacy compatibility working');
        });
    });

    describe('validateResponse', () => {
        it('should validate response schema correctly', function() {
            // Arrange
            const response = {
                isValid: true,
                code: 'DOTBA',
                effect: 'Abre la barrera electromagnética',
                stateChanges: { barreraElectromagneticaAbierta: true },
                message: 'Código válido'
            };

            // Act & Assert
            expect(() => CheckCodes.validateResponse(response)).to.not.throw();
            
            console.log('✅ Response validation working');
        });
    });
});